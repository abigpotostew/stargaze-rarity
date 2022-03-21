import { Config } from "../config";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";


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

  async contractInfo(sg721Address:string) : Promise<ContractInfo|null> {
    const minter = await this.client.queryContractSmart(sg721Address, { minter: {}})
    const minterAddress = minter.minter as string
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
