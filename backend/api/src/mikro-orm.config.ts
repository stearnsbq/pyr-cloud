export default {
    entities: ['./dist/model'], 
    entitiesTs: ['./src/model'], 
    dbName: 'pyr-cloud',
    type: 'postgresql',
    connect: true,
    host: process.env.DATABASE_URL,
    port: 5432,
    password: process.env.DATABASE_PASSWORD,
}