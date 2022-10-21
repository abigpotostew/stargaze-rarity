import { CosmWasmClient } from 'cosmwasm';

const minter= 'stars1h36lesetp943pcnf9xehugtd2pfj7m5t9e9879mjj85fc9vtm25qutjky5';
const sg721= "stars17xn7crwcc05p5cg5evsl7zz4w3z2ajtysn0j3dnckfdnjxykvvrs3yktgg";

const client = await CosmWasmClient.connect('https://rpc.castor-1.stargaze-apis.com/');

const query =async (msg:any)=>{
  const res = await client.queryContractSmart(sg721, msg);
  console.log('query response:', res);
}
const queryMinter =async (msg:any)=>{
  const res = await client.queryContractSmart(minter, msg);
  console.log('query response:', res);
}

await query({ num_tokens: {} })
await query({collection_info: {}})


