import { createRetryClient } from "./axios";
import { AxiosRequestConfig, AxiosResponse } from "axios";

const retries = 10;
const httpClientTimeout = 4500
const tokenRequestTimeout = 16000
const client = createRetryClient({ retries, noResponseRetries: 0 })

export interface MetadataResponse {
  isNotFound: boolean;
  data: any
}

export const fetchMetadata = async (gateways: string[], cid: string, tokenId: string): Promise<MetadataResponse|null> => {
  const options = {
    headers: { Accept: 'application/json,text/html,text/plain,text/plain;charset=UTF-8' },
  };
  let isNotFoundCount = 0;
  for (let gateway of gateways) {
    const res = await get(gateway, cid, tokenId, options)
    if(res && res.isNotFound){
      isNotFoundCount++;
      continue;
    }
    if (res) {
      return res;
    }
  }
  if(isNotFoundCount === gateways.length){
    return {isNotFound:true, data:null}
  }
  return null;

};

const sleep = ms => new Promise(r => setTimeout(r, ms));


const get = async (gateway: string, cid: string, tokenId: string, options?: AxiosRequestConfig): Promise<MetadataResponse | null> => {
  const uri = cleanupUrl(`${gateway}/${cid}/${tokenId}`)
  options.timeout = httpClientTimeout;
  const response: any = await Promise.race([invokeGet(uri,options), sleep(tokenRequestTimeout)])
  if (!response) {
    console.log(`Timeout fetching ${uri}`)
    return null;
  }
  if (response.error) {
    console.log(`Failed to fetch ${uri}. Got status ${response.error.status}`)
    if (response.error?.response?.status === 404) {
      return { isNotFound: true, data: undefined }
    }
    return null;
  }
  if (response.res.status !== 200) {
    console.log(`Failed to fetch ${uri}. Got status ${response.res.status}`)
    return null;
  }
  return { isNotFound: false, data: await response.res.data }
}

const cleanupUrl = (url: string) => {
  // some contracts have a double slash in the token
  // https://stackoverflow.com/questions/40649382/how-to-replace-double-multiple-slash-to-single-in-url
  return url.replace(/(https?:\/\/)|(\/)+/g, '$1$2');
}

const invokeGet = async (url: string, options?: AxiosRequestConfig): Promise<{ res: AxiosResponse | null; error: Error | null }> => {
  try {
    return { res: await client.get(url, options), error: null }
  } catch (e) {
    e.status = 'ERRORCONN';
    return { res: null, error: e }
  }
}