import axios from 'axios';

let cachedToken = null;
let tokenExpiresAt = 0;

export async function getFatSecretToken() {
    // Если токен ещё жив — возвращаем его
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

