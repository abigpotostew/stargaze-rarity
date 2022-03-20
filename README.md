## Setup

Run this command to initialize a new project in a new working directory.

```
npm i -g serverless
npm install
```

## Usage
`cp .env.example `

** local setup **

setup postgres 13 locally:
* install it
* Login as admin `psql -U <admin username> postgres`
* `create user stargazeuser with encrypted password 'stargaze10';`
* `create database stargaze_rarity;`
* `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO stargazeuser;`
* `exit`



**Deploy**

1. configure aws

2.
```
$ serverless deploy
```

**Invoke the function locally.**

```
sls offline
then invoke from curl localhost:3000/
```

**Invoke the function**

```
curl https://xxxxxxxxx.execute-api.us-east-1.amazonaws.com/
```

**Create a contract**
```curl
curl --location --request POST 'localhost:3000/contract' \
--header 'Content-Type: application/json' \
--data-raw '{"contractId":"stars1tcpnf8nuywsalf4h30pw646a83vckqjvgacwj7"}'
```
**Read a contract**
```curl
curl --location --request GET 'localhost:3000/contract/stars1tcpnf8nuywsalf4h30pw646a83vckqjvgacwj7'
```

-----
Migrations:
* Create migration
`npm run typeorm migration:create -n <name>`
* run all
`npm run typeorm migration:run`
* revert last migration
`npm run typeorm migration:revert`

----

Notes on the functionality:
- Nfts are minted sequentially. Any gaps will result in a failure.
- if one nft doesn't have a trait that others have, that is still considered in the rarity score for that one.
- 

---

testing:
hyperion sg721 - stars18a0pvw326fydfdat5tzyf4t8lhz0v6fyfaujpeg07fwqkygcxejsnp5fac 
    1024 tokens
fren  - stars1ltd0maxmte3xf4zshta9j5djrq9cl692ctsp9u5q0p9wss0f5lmsvd9ukk
    5000 tokens
sg punks - stars17s7emulfygjuk0xn906athk5e5efsdtumsat5n2nad7mtrg4xres3ysf3p
    8888 tokens