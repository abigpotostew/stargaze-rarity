import { SG721 } from "./database/entities/sg721.entity";
import { DataSource, In } from "typeorm";
import { ExtTrait, TraitValue } from "./database/utils/types";
import { SG721Trait } from "./database/entities/sg721Trait.entity";
import { Token } from "./database/entities/token.entity";
import { TokenMeta } from "./database/entities/tokenMeta.entity";
import { TokenTrait } from "./database/entities/tokenTrait.entity";
import { SG721Meta } from "./database/entities/sg721Meta.entity";
import { saveChunked } from "./database/insert-chunk";
import { defaultConfig } from "./config";

const cacheOpts = {
  cache: defaultConfig().cacheDurationMs,
}

export class Repository {
  private readonly db: DataSource;

  constructor(db: DataSource) {
    this.db = db;
  }
  
  async getToken(contractId: string, tokenId: string): Promise<Token | undefined> {
    return await this.db.manager.getRepository(Token).findOne({
      where: [{
        contract_address: contractId,
        tokenId: tokenId
      }], relations: ["meta", "traits", "traits.trait", "contract.meta"],
      ...cacheOpts,
    });
  }


  async getTokens(contractId: string, take: number | undefined, skip: number | undefined): Promise<Token[] | undefined> {
    return await this.db.manager.getRepository(Token).find({
      where: [{ contract_address: contractId }],
      take,
      skip,
      relations: ["meta", "traits", "traits.trait", "contract.meta"],
      order: { meta: { score: 'DESC' } },
      ...cacheOpts,
    });
  }

  async getContract(contractId: string): Promise<SG721 | undefined> {
    return await this.db.manager.getRepository(SG721).findOne({
      where: [{ contract: contractId }],
      relations: ["meta", "traits"],
      ...cacheOpts,
    });
  }

  async getContracts(take: number | undefined, skip: number | undefined): Promise<SG721[] | undefined> {
    return await this.db.manager.getRepository(SG721).find({
      take,
      skip,
      relations: ["meta", "traits"],
      order: { createdAt: 'DESC' },
      ...cacheOpts,
    });
  }

  async createContract(contractId: string): Promise<SG721> {
    const sg721repo = this.db.manager.getRepository(SG721)
    let contract = sg721repo.create()
    contract.contract = contractId

    return await sg721repo.save(contract)
  }

  async persistIngestedData(
    contract: string,
    allTraits: { [key: string]: Map<TraitValue, number> },
    tokenTraits: Map<string, ExtTrait[]>,
    scores: Map<string, number>,
    rankings: Map<string, number>,
    mintedTokens: string[]
  ) {
    try {
      const contractRepo = this.db.manager.getRepository(SG721)
      const c = await contractRepo.findOne({ where: { contract } })
      if (c) {
        const traits = await this.addContractTraits(c, allTraits)
        const tokens = await this.addTokens(c, tokenTraits, scores, rankings, mintedTokens)
        return {
          traits,
          tokens
        }
      }
    }catch (e) {
      console.log('cannot save to db', e)
      throw e
    }
  }

  async addTokens(
    contract: SG721,
    tokenTraits: Map<string, ExtTrait[]>,
    scores: Map<string, number>,
    rankings: Map<string, number>,
    mintedTokens: string[]
  ): Promise<Token[]> {
    const tokensRepo = this.db.manager.getRepository(Token)
    const tokenMetaRepo = this.db.manager.getRepository(TokenMeta)
    const tokenTraitsRepo = this.db.manager.getRepository(TokenTrait)
    const sg721MetaRepo = this.db.manager.getRepository(SG721Meta)
    const sg721TraitsRepo = this.db.manager.getRepository(SG721Trait)

    console.log("Saving sg721 meta")


    const sg721Meta = sg721MetaRepo.create()
    sg721Meta.contract = contract
    sg721Meta.count = scores.size
    sg721Meta.minted = mintedTokens.length
    
    await saveChunked(sg721MetaRepo, SG721Meta, [sg721Meta], '"sg721_meta_unique_contract"', false,
      `count = EXCLUDED.count
      WHERE (sg721_meta.count) is distinct from (EXCLUDED.count)`)

    // await sg721MetaRepo.save(sg721Meta)

    const tokens: Token[] = []
    for (let [tokenId, score] of scores) {
      const extTraits: ExtTrait[] = tokenTraits.get(tokenId)
      const rank: number = rankings.get(tokenId)
      const token = tokensRepo.create()
      token.tokenId = tokenId

      const traits = extTraits.map((t) => {
        const tokenTrait = tokenTraitsRepo.create()
        tokenTrait.traitType = t.trait_type
        tokenTrait.value = {v: t.value}
        tokenTrait.token = token
        tokenTrait.contract = contract
        return tokenTrait
      })
      const meta = tokenMetaRepo.create()
      meta.contract = contract
      meta.token = token
      meta.score = score
      meta.rank = rank

      token.traits = traits
      token.meta = meta
      token.contract = contract
      token.contract_address = contract.contract
      tokens.push(token)
    }
    console.log("Saving tokens and the rest")

    let i: number, j: number;
    const chunkSize = 250;
    for (i = 0, j = tokens.length; i < j; i += chunkSize) {
      let chunk = tokens.slice(i, i + chunkSize);

      chunk = Array.from(chunk.reduce((map,curr)=>{
        const key =curr.tokenId
        map.set(key, curr)
        return map;
      }, new Map<string,Token>()).values())
      await saveChunked(tokensRepo, Token, chunk, '"token_unique_id_contract"', true, undefined, chunkSize)
      const tokenWithId = await tokensRepo.find({where: {tokenId: In(chunk.map(t => t.tokenId))}})
      const idMap = tokenWithId.reduce((acc, t) => {
        acc[t.tokenId] = t.id
        return acc
      }, {} as { [key: string]: number })
      for (let token of tokens) {
        token.id = idMap[token.tokenId]
      }
      
      let metas = Array.from(chunk.map((t)=>t.meta).reduce((map,curr)=>{
        const key =curr.token.tokenId
        map.set(key, curr)
        return map;
      }, new Map<string,TokenMeta>()).values())
      await saveChunked(tokenMetaRepo, TokenMeta, metas, '"token_meta_unique_token_contract"', false,
        `
        rank = EXCLUDED.rank, 
        score = EXCLUDED.score 
        WHERE (
        token_meta.rank, 
        token_meta.score) 
        is distinct from (
        EXCLUDED.rank,
        EXCLUDED.score)`,
        chunkSize)

      let traits = Array.from(chunk.map(t => t.traits).flat().reduce((map,curr)=>{
        const key = curr.token.tokenId + curr.traitType
        map.set(key, curr)
        return map;
      }, new Map<string,TokenTrait>()).values())
      await saveChunked(tokenTraitsRepo, TokenTrait, traits, '"token_traits_contract_token_trait_type_unique"', false,
        `
        value = EXCLUDED.value 
        WHERE (
        token_traits.value
        ) 
        is distinct from (
        EXCLUDED.value)`,
        chunkSize)
    }

    // await tokensRepo.save(tokens, { chunk: 250 })


    console.log("running update")
    // Update token traits
    // At some point we should migrate this to typeorm
    // but I was too lazy
    const sqlQuery = `
        UPDATE token_traits t
        SET trait_id = s.id FROM   sg721_traits s
        WHERE s.trait_type = t.trait_type
          AND s.value = t.value
          AND s.contract_id = t.contract_id
    `
    await this.db.manager.query(sqlQuery);

    console.log("Finished persisting")
    return tokens;
  }

  async addContractTraits(contract: SG721, allTraits: { [key: string]: Map<TraitValue, number> }): Promise<SG721Trait[]> {
    const traitsRepo = this.db.manager.getRepository(SG721Trait)
    const traits: SG721Trait[] = []
    for (let traitType in allTraits) {
      for (let [traitValue, count] of allTraits[traitType]) {
        const trait = traitsRepo.create()
        trait.traitType = traitType
        trait.value = { v: traitValue }
        trait.count = count
        trait.contract = contract
        traits.push(trait)
      }
    }
    const uniqueTraits = traits.reduce((map,curr)=>{
      const key =curr.traitType+JSON.stringify(curr.value);
      map.set(key, curr)
      return map;
    }, new Map<string,SG721Trait>())

    const uniq=Array.from(uniqueTraits.values());
    await saveChunked(traitsRepo, SG721Trait, uniq, '"sg721_traits_unique"', false, `
    count = EXCLUDED.count
      WHERE (sg721_traits.count) is distinct from (EXCLUDED.count)`, 500)
    // await traitsRepo.insert(traits);
    return uniq;
  }
}