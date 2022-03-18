import { SG721 } from "./database/entities/sg721.entity";
import { Connection } from "typeorm";
import { TraitValue, ExtTrait } from "./database/utils/types";
import { SG721Trait } from "./database/entities/sg721Trait.entity";
import { Token } from "./database/entities/token.entity";
import { TokenMeta } from "./database/entities/tokenMeta.entity";
import { TokenTrait } from "./database/entities/tokenTrait.entity";
import { SG721Meta } from "./database/entities/sg721Meta.entity";

export class Repository {
  private readonly db: Connection;

  constructor(db: Connection) {
    this.db = db;
  }


  async getToken(contractId: string, tokenId: string): Promise<Token | undefined> {
    return await this.db.manager.getRepository(Token).findOne({ where: [{ contract: contractId }, { tokenId: tokenId }], relations: ["meta", "traits", "traits.trait"] });
  }

  async getContract(contractId: string): Promise<SG721 | undefined> {
    return await this.db.manager.getRepository(SG721).findOne({ contract: contractId }, { relations: ["meta", "traits"] });
  }

  async getContracts(take: number | undefined, skip: number | undefined): Promise<SG721[] | undefined> {
    return await this.db.manager.getRepository(SG721).find({ take, skip, relations: ["meta", "traits"] });
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
  ) {
    const contractRepo = this.db.manager.getRepository(SG721)
    const c = await contractRepo.findOne({ contract })
    if (c) {
      const traits = await this.addContractTraits(c, allTraits)
      const tokens = await this.addTokens(c, tokenTraits, scores, rankings)
      return {
        traits,
        tokens
      }
    }
  }

  async addTokens(
    contract: SG721,
    tokenTraits: Map<string, ExtTrait[]>,
    scores: Map<string, number>,
    rankings: Map<string, number>
  ): Promise<Token[]> {
    const tokensRepo = this.db.manager.getRepository(Token)
    const tokenMetaRepo = this.db.manager.getRepository(TokenMeta)
    const tokenTraitsRepo = this.db.manager.getRepository(TokenTrait)

    console.log("Saving sg721 meta")

    const sg721MetaRepo = this.db.manager.getRepository(SG721Meta)
    const sg721Meta = sg721MetaRepo.create()
    sg721Meta.contract = contract
    sg721Meta.count = scores.size
    sg721MetaRepo.save(sg721Meta)

    const tokens: Token[] = []
    for (let [tokenId, score] of scores) {
      const extTraits: ExtTrait[] = tokenTraits.get(tokenId)
      const rank: number = rankings.get(tokenId)
      const token = tokensRepo.create()
      token.tokenId = tokenId

      const traits = extTraits.map((t) => {
        const tokenTrait = tokenTraitsRepo.create()
        tokenTrait.traitType = t.trait_type
        tokenTrait.value = t.value
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
    
    tokensRepo.save(tokens)
    return tokens;
  }

  async addContractTraits(contract: SG721, allTraits: { [key: string]: Map<TraitValue, number> }): Promise<SG721Trait[]> {
    const traitsRepo = this.db.manager.getRepository(SG721Trait)
    this.db.manager.connection.createQueryBuilder
    const traits: SG721Trait[] = []
    for (let traitType in allTraits) {
      for (let [traitValue, count] of allTraits[traitType]) {
        const trait = traitsRepo.create()
        trait.traitType = traitType
        trait.value = traitValue
        trait.count = count
        trait.contract = contract
        traits.push(trait)
      }
    }
    console.log(traits)
    await traitsRepo.insert(traits);
    return traits;
  }
}