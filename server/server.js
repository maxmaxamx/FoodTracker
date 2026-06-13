import express from 'express';
import cors from 'cors';
import smartRouter from "./routes/smartRouter.js"
import { pool } from "./database.js";
import { sendEmail, sendMAIL } from './helpers/mailSETUP.js';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';

export const app = express();

app.use(express.json());

// app.use(session({
//     secret: 'mySuperSecretPhrase21323411341335566734recdgdf',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         secure: false,
//         httpOnly: true
//     }
// }))

const pgSession = connectPgSimple(session.default || session);
app.set('trust proxy', 1); //Когда Express работает за Nginx, он видит запросы не напрямую от пользователя, а от Nginx. Из-за этого Express думает, что все запросы приходят из локальной сети Docker, и не может корректно определить IP-адрес клиента и протокол (HTTP/HTTPS). Для сессий это критично.
app.use(session({
    store: new pgSession({
        pool: pool,
        tableName: 'session'
    }),
    secret: process.env.SESSION_SECRET || 'секрет',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: 'lax', // Исправлено с true на 'lax'
        secure: false, // Оставляем false для HTTP. Если подключишь HTTPS в Nginx, нужно будет поставить true
        httpOnly: true //
    }
}));

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