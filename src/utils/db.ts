import { Client } from 'pg';

export const client = new Client({
    host: 'localhost',
    port: 5432,
    user: process.env.PG_USERNAME
    password: process.env.PG_PASSWORD
    database: process.env.PG_DATABASE
});

client.connect();
