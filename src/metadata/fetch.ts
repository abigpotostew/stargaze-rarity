
import { createRetryClient } from "./axios";
import { AxiosRequestConfig, AxiosResponse } from "axios";

const client = createRetryClient({retries:6, noResponseRetries:3})

export const fetchMetadata= async (gateways:string[],cid:string, tokenId:string):Promise<any>=>{
  const options = {
    headers: { Accept: 'application/json,text/html,text/plain,text/plain;charset=UTF-8' },
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

const get = async (gateway:string, cid:string, tokenId:string, options?:AxiosRequestConfig):Promise<any|null>=>{
  const uri = `${gateway}/${cid}/${tokenId}`
  // console.log(uri)
  options.timeout = 15000
  const response :any= await  invokeGet(uri,options);//Promise.race([invokeGet(uri,options), sleep(15000)])
  if(!response){
    console.log(`Timeout fetching ${uri}`)
    return null;
  }
  if(response.error){
    console.log(`Failed to fetch ${uri}. Got status ${response.error.status}`)
    return null;
  }
  if(response.res.status!==200){
    console.log(`Failed to fetch ${uri}. Got status ${response.res.status}`)
    return null;
  }
  
  return await response.res.data
}

const invokeGet = async (url:string, options?:AxiosRequestConfig):Promise< { res:AxiosResponse|null;error: Error|null}>=>{
  try{
    return { res:await client.get(url, options),error:null }
  }catch (e) {
    console.log('failure fetching url ' +url)
    e.status=500;
    return {res:null, error:e}
  }
}