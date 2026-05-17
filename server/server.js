import express from 'express';
import cors from 'cors';
import smartRouter from "./routes/smartRouter.js"
import { pool } from "./database.js";
import { sendEmail, sendMAIL } from './helpers/mailSETUP.js';
import session from 'express-session';

export const app = express();

app.use(cors({
    origin: ['http://localhost:4200', 'http://localhost:80'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(session({
    secret: 'mySuperSecretPhrase21323411341335566734recdgdf',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true
    }
}))

console.log('FATSECRET_CLIENT_ID:', process.env.FATSECRET_CLIENT_ID ? '✅' : '❌');
console.log('FATSECRET_CLIENT_SECRET:', process.env.FATSECRET_CLIENT_SECRET ? '✅' : '❌');

app.use("/api", smartRouter);

pool.query('SELECT 1')
    .then(() => console.log('✅ DB connected'))
    .catch(err => {
        console.error('⚠️ DB not ready yet:', err.message);
        setTimeout(() => {
            pool.query('SELECT 1').catch(() => { });
        }, 10000);
    });

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(` Server started on http://localhost:${port}`);
});