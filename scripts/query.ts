import { CosmWasmClient } from 'cosmwasm';

const minter= 'stars187zds75uenfxht2zqz7e0wxn3ushcawvf2ndrns6q63hgfn6ptqqt0ayra';
const sg721= "stars18a0pvw326fydfdat5tzyf4t8lhz0v6fyfaujpeg07fwqkygcxejsnp5fac";

const client = await CosmWasmClient.connect('https://rpc.stargaze-apis.com/');

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


