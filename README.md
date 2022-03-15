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



----
Progress Notes 3/14:
1. Plan is to deploy lambdas with `sls deploy`. Database to be manually created.
2. Local dev using `npm run start` which automatically recompiles. Debug by debugging the `npm run start` node process
3. Stopping point-- stuck on loading the entities for typeorm.