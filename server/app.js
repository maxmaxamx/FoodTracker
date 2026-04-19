import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

let catchedTocken = null;
let tokenExpire = 0;

async function getFatTocken(params) {
    if (catchedTocken && Date.now() < tokenExpire - 60_000) {
        return catchedTocken
    }

    const credentials = Buffer.from(
        `${process.env.FATSECRET_CLIENT_ID}:${process.env.FATSECRET_CLIENT_SECRET}`
    ).toString('base64');

    const body = new URLSearchParams({
        grant_type: 'client_credentials',
        scope: 'basic'
    });

    const response = await axios.post(
        ''
    )
}


