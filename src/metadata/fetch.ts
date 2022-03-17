
import { fetchRetry as fetch } from "../utils/fetch-retry";

export const fetchMetadata= async (gateways:string[],cid:string, tokenId:string):Promise<any>=>{
  const options = {
    method: 'GET',
    headers: { Accept: 'application/json,text/html,text/plain,text/plain;charset=UTF-8' }
  };
  for (let gateway of gateways) {
    const res= await get(gateway,cid,tokenId,options)
    if(res){
      return res;
    }
  }
  return null;
  
};
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const get = async (gateway:string, cid:string, tokenId:string, options:any):Promise<any|null>=>{
  const uri = `${gateway}/${cid}/${tokenId}`
  // console.log(uri)
  const response :any= await  Promise.race([fetch(uri, options), sleep(10000)])
  if(!response){
    console.log(`Timeout fetching ${uri}`)
    return null;
  }
  if(response.status!==200){
    console.log(`Failed to fetch ${uri}. Got status ${response.status}`)
    return null;
  }
  
  return await response.json()
}