import express from 'express';
import cors from 'cors';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import 'dotenv/config';

import sequelize, { pool } from './database.js';
import smartRouter from './routes/smartRouter.js';

import './models/index.js';

export const app = express();

app.use(express.json());
app.use(cors({
    origin: ['http://localhost', 'http://localhost:4200'],
    credentials: true,
}));

const PgSession = connectPgSimple(session);

app.set('trust proxy', 1);
app.use(session({
    store: new PgSession({
        pool: pool,
        tableName: 'session',
        createTableIfMissing: true, 
    }),
    secret: process.env.SESSION_SECRET || 'секрет',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: 'lax',
        secure: false,
        httpOnly: true,
    },
}));

app.use('/api', smartRouter);

const startServer = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('✅ Database synchronized');

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