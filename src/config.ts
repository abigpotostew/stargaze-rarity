export class Config {
  public readonly rpcEndpoint = process.env.RPC_ENDPOINT || 'https://rpc.stargaze-apis.com/';
  public readonly pinataGatewayBaseUrl = process.env.PINATA_GATEWAY_BASE_URL || 'https://stargaze.mypinata.cloud/ipfs';
  public readonly ipfsIoBaseUrl = process.env.IPFS_GATEWAY_BASE_URL || 'https://ipfs.io/ipfs';
  public readonly ipfsGatewayBaseUrl = process.env.IPFS_GATEWAY_BASE_URL || 'https://gateway.ipfs.io/ipfs';
  public readonly cloudflareGatewayBaseUrl = process.env.IPFS_GATEWAY_BASE_URL || 'https://cloudflare-ipfs.com/ipfs';
  public readonly concurrentIPFSDownloads = parseInt(process.env.CONCURRENT_IPFS_DOWNLOADS||'100')
}

let config: Config|null=null;
export const defaultConfig = () => {
  if (!config) config = new Config();
  return config
}