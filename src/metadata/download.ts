import { QueryContract } from "../cosmwasm/sg721";
import { defaultConfig } from "../config";
import { fetchMetadata } from "./fetch";
import asyncPool = require("tiny-async-pool");

type TraitValue = string | number | boolean | null;

interface Trait {
  trait_type: string;
  value: TraitValue;
}

const getCid = (baseUri: string) => {
  return baseUri.replace('ipfs://', '')
}

export const getContractMetadata = async (sg721Contract: string) => {
  const config = defaultConfig();
  const queryContract = await QueryContract.init(config)
  const contractInfo = await queryContract.contractInfo(sg721Contract)
  if (!contractInfo) {
    throw new Error(`Contract ${sg721Contract} not found`)
  }
  return contractInfo
}

export const downloadMetadata = async (sg721Contract: string) => {
  // get contract info
  const config = defaultConfig();
  const contractInfo = await getContractMetadata(sg721Contract)

  //assume it's sequential, without gaps in token ids

  const cid = getCid(contractInfo.baseUri)

  const allTraits: { [key: string]: Map<TraitValue, number> } = {};
  const tokenTraits = new Map<string, Trait[]>();
  const gateways = [config.pinataGatewayBaseUrl, config.ipfsGatewayBaseUrl, config.ipfsIoBaseUrl, config.cloudflareGatewayBaseUrl]
  await asyncPool(config.concurrentIPFSDownloads, [...Array(contractInfo.totalSupply).keys()], async (i: number) => {
    i = i + 1;
    let metadata = await fetchMetadata(gateways, cid, i.toString())
    if (!metadata) {
      throw new Error(`Failed to fetch token metadata ${i}`)
    }
    let traits: Trait[] = [];
    const attributes = metadata.traits || metadata.attributes;
    if (Array.isArray(attributes)) {
      traits = attributes as Trait[]
    }

    // save to db here?

    // count trait frequency
    for (let trait of traits) {
      if (!allTraits[trait.trait_type]) {
        allTraits[trait.trait_type] = new Map<TraitValue, number>();
      }
      const current = allTraits[trait.trait_type].get(trait.value) || 0;
      allTraits[trait.trait_type].set(trait.value, current + 1)
    }
    tokenTraits.set(i.toString(), traits)
  })

  const numTokens = tokenTraits.size;
  const allTraitNames = Object.keys(allTraits)
  // counts for empty traits
  for (let tokenId of tokenTraits.keys()) {
    const thisTokenTraits = tokenTraits.get(tokenId)
    for (let traitName of allTraitNames) {
      const trait = thisTokenTraits.find(t => t.trait_type === traitName)
      if (trait === undefined) {
        const current = allTraits[traitName].get(null) || 0;
        allTraits[traitName].set(null, current + 1)
      }
    }
  }
  // now calculate scores
  const scores = new Map<string, number>();
  for (let tokenId of tokenTraits.keys()) {
    const thisTokenTraits = tokenTraits.get(tokenId)
    let score = 0;
    for (let traitName of allTraitNames) {
      const trait = thisTokenTraits.find(t => t.trait_type === traitName)
      const traitvalue = trait?.value || null;
      const s = 1 / (allTraits[traitName].get(traitvalue) / numTokens)
      score += s;
    }
    scores.set(tokenId, score)
  }

  const rankingInfo: { tokenId: string, score: number, numTraits: number, rank: number }[] = [];
  for (let tokenId of tokenTraits.keys()) {
    const thisTokenTraits = tokenTraits.get(tokenId)
    rankingInfo.push({ tokenId, score: scores.get(tokenId), numTraits: thisTokenTraits.length, rank: null })
  }

  const rankings = new Map<string, number>(
    rankingInfo
      .sort((a, b) => {
        return a.score - b.score || a.numTraits - b.numTraits || parseInt(a.tokenId) - parseInt(b.tokenId)
      })
      .reverse()
      .map((r, i) => [r.tokenId, i + 1] as [string, number])
  )

  // analysis on traits
  console.log('done')
  return {
    allTraits,
    tokenTraits,
    scores,
    numTokens,
    tokenIds: Array.from(tokenTraits.keys()),
    rankings
  }
}