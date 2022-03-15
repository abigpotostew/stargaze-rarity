const env = process.env.NODE_ENV || 'development';

module.exports = {
    type: 'postgres',
    
    host: process.env.POSTGRESQL_HOST,
    port: Number(process.env.POSTGRESQL_PORT),
    username: process.env.POSTGRESQL_USERNAME,
    password: process.env.POSTGRESQL_PASSWORD,
    database: process.env.POSTGRESQL_DATABASE,
    
    synchronize: true,
    logging: true,
    maxQueryExecutionTime: 4000,
    entities: [
        // env === 'production' ? 'dist/database/entities/*{.ts,.js}' : 'src/database/entities/*{.ts,.js}',
        'src/database/entities/*{.ts,.js}'
    ],
    migrations: [
        // env === 'production'
        //     ? 'dist/database/migrations/*{.ts,.js}'
        //     : 'src/database/migrations/*{.ts,.js}',
        'src/database/entities/*{.ts,.js}'
    ],
    cli: {
        entitiesDir: 'src/database/entities',
        migrationsDir: 'src/database/migrations',
        subscribersDir: 'src/database/subscribers',
    },
};
