import { Config } from "../config";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";


const paginationLimit = 30;

export interface ContractInfo {
  minterAddress: string,
  minterConfig: MinterConfigRes,
  totalSupply: number,
  maxTokens: number,
  baseUri: string
}

interface MinterConfigRes{
  admin:string;// 'stars1euu359d2cwe46j8a8fqkmcrhzjq6j642htt7rn',
  base_token_uri:string;// 'ipfs://bafybeigpdi7agocjhum27khtlpxd7me6kprftmu6jrb4ki3qv3wt3glure',
  num_tokens: number;//1024,
  per_address_limit: number;//50,
  sg721_address: number;//'stars18a0pvw326fydfdat5tzyf4t8lhz0v6fyfaujpeg07fwqkygcxejsnp5fac',
  sg721_code_id: number;//1,
  start_time: number;//'1647032400000000000',
  unit_price: number;//{ denom: 'ustars', amount: '314000000' },
  whitelist: string|null;
}

export class QueryContract {
  private readonly client: CosmWasmClient;

  constructor(client: CosmWasmClient) {
    this.client = client;
  }

  public static async init(config: Config) {
    const client = await CosmWasmClient.connect(config.rpcEndpoint);
    return new QueryContract(client);
  }
  
  public async isSg721(address:string){
    try{
      return !!(await this.getMinterAddress(address))
    }catch (e) {
      return false;
    }
  }
  
  public async isMinter(address:string){
    try{
      return !!(await this.getSg721Address(address))
    }catch (e) {
      return false;
    }
  }

  public async getSg721Address(address:string){
     return (await this.client.queryContractSmart(address, { config: {}})).sg721_address as string;
  }

  private async getMinterAddress(address:string){
     return (await this.client.queryContractSmart(address, { minter: {}})).minter as string;
  }

  public async getMintedTokens (address:string, startAfter:string){
    const q:any = {
      all_tokens: {
        limit: paginationLimit,
      },
    };
    if (startAfter) {
      q.all_tokens.start_after = startAfter;
    }
    // console.log("getAllMintedTokens", q);
    return (await this.client.queryContractSmart(address, q)).tokens;
  };

  public async getAllMintedTokens(address:string){
    const tokens:any[] = []
    let startAfter:string = null

    do {
      const r = await this.getMintedTokens(address, startAfter)      
      tokens.push(...r)
      startAfter = (r.length >= paginationLimit) ? r[r.length - 1] : null
    } while(startAfter)
    return tokens;
  }
  
  async contractInfo(sg721Address:string) : Promise<ContractInfo|null> {
    const minterAddress = await this.getMinterAddress(sg721Address) 
    if(!minterAddress){
      console.log("no minter address")
      return null
    }
    const minterConfig:MinterConfigRes = await this.client.queryContractSmart(minterAddress, { config: {} });
    const maxTokens = minterConfig.num_tokens;
    const baseUri = minterConfig.base_token_uri
    const totalSupplyRes = await this.client.queryContractSmart(sg721Address, { num_tokens: {}})
    const totalSupply = totalSupplyRes.count as number;
    if(!baseUri){
        console.log("no base URI")
        return null
    }
    return {
      minterAddress,
      minterConfig,
      totalSupply,
      maxTokens,
      baseUri
    }
  }
}
