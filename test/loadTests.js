import http from 'k6/http';
import { group } from 'k6';
import { fixtures } from './fixtures.js';

export default function () {

  const { HOST } = __ENV

  // Read Contract
  fixtures.contracts.forEach((c) => {
    http.get(http.url`${HOST}/contracts/${c.contract}`);
  })
  const pages = [...Array(10).keys()]

  // List Contracts
  pages.forEach((page) => {
    http.get(http.url`${HOST}/contracts?page=${page}`);
  })

  // Read Tokens
  fixtures.contracts.forEach((c) => {
    // Note: This may result in 404 if the mints were out of order
    const maxIterations = Math.min(c.minted, 10)
    for (let i = 1; i < maxIterations; i++) {
      http.get(http.url`${HOST}/contracts/${c.contract}/rarities/${i}`);
    }
  })

  // List Tokens
  fixtures.contracts.forEach((c) => {
    http.get(http.url`${HOST}/contracts/${c.contract}/rarities`);
  })

}