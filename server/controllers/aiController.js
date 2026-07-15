import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';
import { readFile, unlink } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname } from 'node:path';
import { IncomingForm } from 'formidable';

// 1. Инициализация переменных окружения
dotenv.config();

// 2. Корректный __dirname для ES-модулей
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 3. Инициализация клиента Groq
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
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
    const prompt = `Analyze this food image and return ONLY a raw JSON object. No markdown, no explanations.
Format: {"Name": "string in Russian", "Calories": number, "Fats": number, "Carbs": number, "Proteins": number}
If not food, Name: "unknown", nutrients: -1.`;

    const imageUrl = await imageToDataUrl(filePath);

    const completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b", // Рабочая vision-модель
        messages: [
            { 
                role: "user", 
                content: [
                    { type: "text", text: prompt },
                    { type: "image_url", image_url: { url: imageUrl } }
                ]
            }
        ],
        temperature: 0.1,
        response_format: { type: "json_object" } // Гарантирует валидный JSON от Groq
    });

    return completion.choices[0]?.message?.content || '{"Name":"unknown","Calories":-1,"Fats":-1,"Carbs":-1,"Proteins":-1}';
}

export async function recognizeFood(req, res) {
    try {
        const form = new IncomingForm({
            uploadDir: join(__dirname, '../media'),
            keepExtensions: true,
            maxFileSize: 10 * 1024 * 1024 // 10 MB
        });

        const [fields, files] = await form.parse(req);
        
        // Проверяем оба возможных имени поля для надежности
        const uploadedFile = files.file?.[0] || files.photo?.[0];

        if (!uploadedFile) {
            return res.status(400).json({ error: "Файл не найден в запросе" });
        }

        // Получаем JSON-строку от AI
        const resultJsonString = await analyzeFoodImage(uploadedFile.filepath);

        // Удаляем временный файл
        await unlink(uploadedFile.filepath).catch(err => console.error("Ошибка удаления файла:", err));

        // Отправляем как есть (Content-Type уже будет application/json)
        res.setHeader('Content-Type', 'application/json');
        return res.send(resultJsonString);

    } catch (error) {
        console.error("Recognition error:", error);
        return res.status(500).json({ 
            error: "SERVER_ERROR", 
            message: error.message || "Внутренняя ошибка сервера" 
        });
    }
}