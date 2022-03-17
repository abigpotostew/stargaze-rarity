import fetchRetryLib from 'fetch-retry';
import fetch from 'node-fetch';

export const fetchRetry = fetchRetryLib(fetch, {
  retries: 3,
  retryDelay: function (attempt, error, response) {
    return Math.pow(2, attempt) * 1000; // 1000, 2000, 4000
  },
  retryOn: [429, 503]
})
