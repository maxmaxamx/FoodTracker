import OpenAI from 'openai';
import dotenv from 'dotenv';
import { readFile, unlink } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname } from 'node:path';
import { IncomingForm } from 'formidable';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
        "HTTP-Referer": "https://foodtracker.online",
        "X-Title": "Food Tracker App",
    },
});

async function imageToDataUrl(filePath) {
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
    const prompt = `Analyze this food image carefully. Think step-by-step about the ingredients, portion size, and cooking method to estimate the nutritional value. Then, return ONLY a raw JSON object. No markdown, no explanations, no code blocks. 
    Format: {"Name": "string in Russian", "Calories": number, "Fats": number, "Carbs": number, "Proteins": number}. 
    If not food, return exactly: {"Name": "unknown", "Calories": -1, "Fats": -1, "Carbs": -1, "Proteins": -1}`;

    const imageUrl = await imageToDataUrl(filePath);

    const completion = await openai.chat.completions.create({
        model: "google/gemini-2.5-flash", 
        messages: [
            { 
                role: "user", 
                content: [
                    { type: "text", text: prompt },
                    { type: "image_url", image_url: { url: imageUrl } }
                ]
            }
        ],
        response_format: { type: "json_object" }
    });

    const response = completion.choices[0]?.message;
    
    if (!response?.content) {
        throw new Error("Empty response from AI");
    }

    let content = response.content;
    
    content = content.replace(/^```(?:json)?\s*|\s*```$/g, '').trim();
    
    const start = content.indexOf('{');
    const end = content.lastIndexOf('}');
    if (start !== -1 && end !== -1) {
        content = content.substring(start, end + 1);
    }

    JSON.parse(content); 
    
    return content;
}

export async function recognizeFood(req, res) {
    // Выносим переменную наружу, чтобы блок finally имел к ней доступ
    let uploadedFilePath = null;

    try {
        const form = new IncomingForm({
            uploadDir: join(__dirname, '../media'),
            keepExtensions: true,
            maxFileSize: 10 * 1024 * 1024 // 10MB
        });

        // Безопасный парсинг для formidable v3 (возвращает объект { fields, files })
        const { files } = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                resolve({ fields, files });
            });
        });

        // Проверяем наличие файла с учетом того, что это может быть массив (v3) или одиночный объект (v2)
        const fileData = files.file || files.photo;
        const uploadedFile = Array.isArray(fileData) ? fileData[0] : fileData;

        if (!uploadedFile || !uploadedFile.filepath) {
            return res.status(400).json({ error: "Файл не найден в запросе" });
        }

        uploadedFilePath = uploadedFile.filepath;

        // Отправляем в ИИ
        const resultJsonString = await analyzeFoodImage(uploadedFilePath);

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).send(resultJsonString);

    } catch (error) {
        console.error("Critical error in recognizeFood:", error.message);
        console.error("Stack:", error.stack);
        
        return res.status(500).json({ 
            error: "SERVER_ERROR", 
            message: error.message || "Внутренняя ошибка сервера при распознавании" 
        });
    } finally {
        // Гарантированно удаляем временный файл в любом сценарии
        if (uploadedFilePath) {
            await unlink(uploadedFilePath).catch(err => {
                console.error("File deletion error in finally:", err.message);
            });
        }
    }
}