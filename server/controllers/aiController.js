import dotenv from 'dotenv';
import { readFile, unlink } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname } from 'node:path';
import { IncomingForm } from 'formidable';
import Groq from 'groq-sdk';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

async function imageToBase64DataUrl(filePath) {
    const buffer = await readFile(filePath);
    const ext = extname(filePath).toLowerCase().replace('.', '');
    const mimeTypes = {
        jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
        webp: 'image/webp', gif: 'image/gif'
    };
    const mimeType = mimeTypes[ext] || 'image/jpeg';
    return `data:${mimeType};base64,${buffer.toString('base64')}`;
}

async function analyzeFoodImage(filePath) {
    const prompt = `Analyze this food image carefully. Estimate the nutritional value. 
Return ONLY a valid JSON object (nothing else):
{
  "Name": "string in Russian",
  "Calories": number,
  "Fats": number,
  "Carbs": number,
  "Proteins": number
}
If this is NOT food, return:
{
  "Name": "unknown",
  "Calories": -1,
  "Fats": -1,
  "Carbs": -1,
  "Proteins": -1
}`;

    const imageUrl = await imageToBase64DataUrl(filePath);

    const completion = await groq.chat.completions.create({
        model: 'qwen/qwen3.6-27b',
        temperature: 0.2,
        max_tokens: 2048,
        messages: [
            {
                role: 'user',
                content: [
                    { type: 'text', text: prompt },
                    {
                        type: 'image_url',
                        image_url: { url: imageUrl }
                    }
                ]
            }
        ]
    });

    let content = completion.choices?.[0]?.message?.content;


    console.log('Content', content);
    if (!content) {
        throw new Error('Empty response from Groq API');
    }

    content = content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

    content = content.replace(/^```(?:json)?\s*/i, '').trim();
    content = content.replace(/\s*```$/i, '').trim();

    const start = content.indexOf('{');
    const end = content.lastIndexOf('}');

    if (start === -1 || end === -1 || end <= start) {
        throw new Error(`No JSON object found in response. Raw: ${content.substring(0, 200)}`);
    }

    const cleaned = content.substring(start, end + 1);

    try {
        JSON.parse(cleaned);
    } catch (parseError) {
        throw new Error(`Invalid JSON returned by AI: ${cleaned}`);
    }

    console.log("Cleaned\n", cleaned)

    return cleaned;
}

export async function recognizeFood(req, res) {
    let uploadedFilePath = null;

    try {
        const form = new IncomingForm({
            uploadDir: join(__dirname, '../media'),
            keepExtensions: true,
            maxFileSize: 10 * 1024 * 1024
        });

        const { files } = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                resolve({ fields, files });
            });
        });

        const fileData = files.file || files.photo;
        const uploadedFile = Array.isArray(fileData) ? fileData[0] : fileData;

        if (!uploadedFile || !uploadedFile.filepath) {
            return res.status(400).json({ error: 'Файл не найден в запросе' });
        }

        uploadedFilePath = uploadedFile.filepath;

        const resultJsonString = await analyzeFoodImage(uploadedFilePath);

        console.log('ResultJsonString\n', resultJsonString)

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).send(resultJsonString);

    } catch (error) {
        console.error('Critical error in recognizeFood:', error.message);
        console.error('Stack:', error.stack);

        return res.status(500).json({
            error: 'SERVER_ERROR',
            message: error.message || 'Внутренняя ошибка сервера при распознавании'
        });
    } finally {
        if (uploadedFilePath) {
            await unlink(uploadedFilePath).catch(err => {
                console.error('File deletion error in finally:', err.message);
            });
        }
    }
}