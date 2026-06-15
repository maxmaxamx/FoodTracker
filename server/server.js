import express from 'express';
import cors from 'cors';
import smartRouter from "./routes/smartRouter.js";
import sequelize, { pool } from "./database.js";
import { sendEmail, sendMAIL } from './helpers/mailSETUP.js';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import 'dotenv/config';

import './models/User.js';
import './models/Food.js';

export const app = express();

app.use(express.json());
app.use(cors({
    origin: ['http://localhost', 'http://localhost:4200'],
    credentials: true
}));

const pgSession = connectPgSimple(session.default || session);
app.set('trust proxy', 1);
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
        sameSite: 'lax',
        secure: false,
        httpOnly: true
    }
}));

console.log('FATSECRET_CLIENT_ID:', process.env.FATSECRET_CLIENT_ID ? '✅' : '❌');
console.log('FATSECRET_CLIENT_SECRET:', process.env.FATSECRET_CLIENT_SECRET ? '✅' : '❌');

app.use("/api", smartRouter);

const startServer = async () => {
    try {
        // Создаём таблицу для сессий
        await pool.query(`
            CREATE TABLE IF NOT EXISTS session (
                sid VARCHAR NOT NULL COLLATE "default",
                sess JSON NOT NULL,
                expire TIMESTAMP(6) NOT NULL,
                PRIMARY KEY (sid)
            );
            CREATE INDEX IF NOT EXISTS idx_session_expire ON session (expire);
        `);
        console.log('✅ Session table ready');

        // Синхронизируем модели с БД
        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({ alter: true });
        } else {
            await sequelize.sync();
        }
        console.log('✅ Database synchronized');

        // Запускаем сервер (только один раз!)
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`🚀 Server running on port ${port}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();