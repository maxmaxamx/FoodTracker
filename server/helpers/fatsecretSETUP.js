import axios from 'axios';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

let cachedToken = null;
let tokenExpiresAt = 0;

export async function getFatSecretToken() {
    if (cachedToken && Date.now() < tokenExpiresAt - 60000) {
        return cachedToken;
    }

    const credentials = Buffer.from(
        `${process.env.FATSECRET_CLIENT_ID}:${process.env.FATSECRET_CLIENT_SECRET}`
    ).toString('base64');

    const body = new URLSearchParams({
        grant_type: 'client_credentials',
        scope: 'basic'
    });

    const response = await axios.post(
        'https://oauth.fatsecret.com/connect/token',
        body.toString(),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${credentials}`
            }
        }
    );

    cachedToken = response.data.access_token;
    tokenExpiresAt = Date.now() + response.data.expires_in * 1000;

    console.log('✅ Новый токен FatSecret получен');
    return cachedToken;
}

