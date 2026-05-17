import { Pool } from 'pg';
import 'dotenv/config';


console.log('DB_HOST:', process.env.DB_HOST); // временно для отладки

export const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432', 10),
});