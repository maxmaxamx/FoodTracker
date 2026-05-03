import axios from 'axios';
import { getFatSecretToken } from "../helpers/fatsecretSETUP.js";

export async function searchFood(req,res) {
    try {
        const q = req.query.q;
        if (!q) {
            return res.status(400).json({ error: 'Параметр q обязателен' });
        }

        const token = await getFatSecretToken();

        const response = await axios.post(
            'https://platform.fatsecret.com/rest/server.api',
            null,
            {
                params: {   
                    method: 'foods.search',
                    search_expression: q,
                    format: 'json',
                    region: 'BY',
                    language: 'ru',
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('❌ Ошибка FatSecret:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Ошибка запроса к FatSecret',
            details: error.response?.data || error.message
        });
    }
}
