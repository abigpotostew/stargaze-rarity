import { DataSource } from "typeorm";
import * as dotenv from 'dotenv';
import "reflect-metadata"

dotenv.config();

const env = process.env.NODE_ENV || 'development';
const isOffline = process.env.SLS_OFFLINE || false
console.log("Environment", env)
const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRESQL_HOST,
    port: Number(process.env.POSTGRESQL_PORT),
    username: process.env.POSTGRESQL_USERNAME,
    password: process.env.POSTGRESQL_PASSWORD,
    database: process.env.POSTGRESQL_DATABASE,
    migrations: [
        isOffline ? '.build/src/database/migrations/*{.ts,.js}' :  'src/database/migrations/*{.ts,.js}'
    ],
    entities: [
        isOffline ? '.build/src/database/entities/*.js' : 'src/database/entities/*{.ts,.js}'
    ],
    cli: {
        entitiesDir: 'src/database/entities',
        migrationsDir: 'src/database/migrations',
        subscribersDir: 'src/database/subscribers',
    },
})

// console.log(dataSource)

export { dataSource }
