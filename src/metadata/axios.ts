import axios, { AxiosInstance } from "axios";
import * as rax from 'retry-axios';

export const createRetryClient = (opts: {
  retries: number;
  noResponseRetries: number;
  statusToRetry?: number[][];
  retryDelay?: number;
}): AxiosInstance => {
  const axiosClient = axios.create();
  axiosClient.defaults.raxConfig = {
    instance: axiosClient,
    // Retry 3 times on requests that return a response (500, etc) before giving up.  Defaults to 3.
    retry: opts.retries,

    // Retry twice on errors that don't return a response (ENOTFOUND, ETIMEDOUT, etc).
    noResponseRetries: opts.noResponseRetries,

    // HTTP methods to automatically retry.  Defaults to:
    // ['GET', 'HEAD', 'OPTIONS', 'DELETE', 'PUT']
    httpMethodsToRetry: ['GET', 'HEAD', 'OPTIONS', 'DELETE', 'PUT'],

    // [[100, 199], [429, 429], [500, 599]]
    statusCodesToRetry: [
      [100, 199],
      [429, 429],
      [404, 408],
      [500, 524, 599],
    ],
    
    retryDelay: opts.retryDelay || 100,
    
    // You can set the backoff type.
    // options are 'exponential' (default), 'static' or 'linear'
    backoffType: 'static',

    // You can detect when a retry is happening, and figure out how many
    // retry attempts have been made
    // onRetryAttempt: (err) => {
    //   const cfg = rax.getConfig(err);
    //   const url = err?.request?._currentUrl||`${err?.request?.protocol}//${err?.request?.host}${err?.request?.path}`;
    //
    //   cfg &&
    //   console.log(
    //     `Retry attempt #${cfg.currentRetryAttempt} for url '${url}' status code '${err?.response?.status || 'CONNTIMEOUT'}'`,
    //   );
    // },
  };
  if (opts.statusToRetry)
    axiosClient.defaults.raxConfig.statusCodesToRetry?.push(...opts.statusToRetry);
  rax.attach(axiosClient);
  return axiosClient;
};