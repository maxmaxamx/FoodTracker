import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { IncomingForm } from 'formidable';
import fs from 'node:fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Инициализируем клиент Groq. Ключ берётся из переменной окружения GROQ_API_KEY
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

async function imageToDataUrl(filePath) {
    const buffer = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase().replace('.', '');

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
Your ONLY task is to analyze food images and respond with EXACTLY a single JSON object.

RULES:
1. Return ONLY the raw JSON object. No markdown blocks (do not use json), no other text, no explanations.
2. The JSON object must strictly match this TypeScript interface:
interface FoodExample {
  Name: string; // MUST BE IN RUSSIAN
  Calories: number;
  Fats: number;
  Carbs: number;
  Proteins: number;
}
3. The "Name" field must always be written in Russian (e.g., "Салат с курицей гриль").
4. All nutrient values (Calories, Fats, Carbs, Proteins) MUST be raw numbers. Do not include units like "g" or "kcal".
5. If you cannot determine a nutrient value, use -1 as the number value.
6. Do not add periods, extra spaces, or preamble.
7. If the image is not food, use "unknown" for Name, and -1 for all nutrient fields.

Example valid response:
{"Name":"Салат с курицей гриль","Calories":250,"Fats":8,"Carbs":15,"Proteins":30}
`;

        let content;
        if (filePath) {
            const imgURL = await imageToDataUrl(filePath);
            content = [
                { type: "text", text: textPrompt },
                { type: "image_url", image_url: { url: imgURL } }
            ];
        } else {
            content = textPrompt;
        }

        const chatCompletion = await groq.chat.completions.create({
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
            messages: [{ role: "user", content }],
            temperature: 0.01,
            max_completion_tokens: 1024,
            top_p: 0.1,
            stream: false,
        });

        const result = chatCompletion.choices[0]?.message?.content || "";
        console.log(result);
        return result;

    } catch (error) {
        console.error("Ошибка Groq:", error?.error || error.message);
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