import { DataSource } from "typeorm";
import * as dotenv from 'dotenv';
import "reflect-metadata"

dotenv.config();

const env = process.env.NODE_ENV || 'development';
export const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRESQL_HOST,
    port: Number(process.env.POSTGRESQL_PORT),
    username: process.env.POSTGRESQL_USERNAME,
    password: process.env.POSTGRESQL_PASSWORD,
    database: process.env.POSTGRESQL_DATABASE,
    migrations: [
        // env === 'production'
        //     ? 'dist/database/migrations/*{.ts,.js}'
        //     : 'src/database/migrations/*{.ts,.js}',
        // 'src/database/migrations/*.ts'
    ],
    entities: [
                // env === 'production' ? 'dist/database/entities/*{.ts,.js}' : 'src/database/entities/*{.ts,.js}',
        // 'src/database/entities/*{.ts,.js}'
        '.build/src/database/entities/*.js'
    ],
    cli: {
        entitiesDir: 'src/database/entities',
        migrationsDir: 'src/database/migrations',
        subscribersDir: 'src/database/subscribers',
    },
})
