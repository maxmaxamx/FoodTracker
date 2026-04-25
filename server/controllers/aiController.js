import axios from 'axios';
import dotenv from 'dotenv';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { IncomingForm } from 'formidable';
import fs from 'node:fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const invokeUrl = "https://integrate.api.nvidia.com/v1/chat/completions";
const stream = false;

const headers = {
    "Authorization": process.env.AI_SECRET,
    "Accept": stream ? "text/event-stream" : "application/json",
    "Content-Type": "application/json"
};


async function imageToDataUrl(filePath) {
    const buffer = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase().replace('.', '');

    // Определяем MIME-тип
    const mimeTypes = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'webp': 'image/webp',
        'gif': 'image/gif'
    };

    const mimeType = mimeTypes[ext] || 'image/jpeg';
    const base64 = buffer.toString('base64');

    return `data:${mimeType};base64,${base64}`;
}


async function makeRequest(filePath) {
    try {
        const textPrompt = `You are a nutrition analysis API. 
Your ONLY task is to analyze food images and respond with EXACTLY this format:
Calories: [number]kcal, Proteins: [number]g, Fats: [number]g, Carbs: [number]g

RULES:
1. Return ONLY this single line, no other text, no explanations, no markdown.
2. If you cannot determine a value, write "unknown" instead of a number.
3. Do not add periods, extra spaces, or formatting.
4. Do not say "I see", "Here is", or any other preamble.
5. If the image is not food, respond: Calories: unknown, Proteins: unknown, Fats: unknown, Carbs: unknown

Example valid responses:
✓ Calories: 250kcal, Proteins: 12g, Fats: 8g, Carbs: 35g
✓ Calories: unknown, Proteins: 5g, Fats: unknown, Carbs: 20g`;

        let content = []
        if (filePath) {
            const imgURL = await imageToDataUrl(filePath);
            content.push({ type: "text", text: textPrompt });
            content.push({ type: "image_url", image_url: { url: imgURL } })
        } else {
            content = textPrompt;
        }

        const payload = {
            "model": "google/gemma-3-27b-it",
            "messages": [{ "role": "user", content }],
            "max_tokens": 100,
            "temperature": 0.01,
            "top_p": 0.1,
            "stream": false
        };

        const response = await axios.post(invokeUrl, payload, { headers });
        console.log(response.data.choices[0].message.content);

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("Ошибка:", error.response?.data || error.message);
        throw error;
    }
}

export async function recognizeFood(req, res) {
    const form = new IncomingForm({
        uploadDir: path.join(__dirname, '../media'),
        keepExtensions: true,
        maxFileSize: 10 * 1024 * 1024
    });

    try {
        const [fields, files] = await form.parse(req);
        const uploadedFile = files.photo?.[0];

        if (!uploadedFile) {
            return res.status(400).json({ error: "No Photos" });
        }
        const result = await makeRequest(uploadedFile.filepath);

        try {
            await fs.unlink(uploadedFile.filepath);
        } catch (unlinkErr) {
            console.error(unlinkErr.message);
        }

        return res.json(result);

    } catch (err) {
        console.error('Recognition error:', err);
        return res.status(500).json({
            error: "SERVER_ERROR",
            message: err.message
        });
    }
}