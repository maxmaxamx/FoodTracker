import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../../.env') });

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});


export async function verifyEmailConnection() {
    try {
        await transporter.verify();
        console.log('✅ SMTP готов к отправке писем');
        return true;
    } catch (error) {
        console.error('❌ Ошибка подключения к SMTP:', error.message);
        return false;
    }
}

export async function sendEmail(to, subject, text) {
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to,
        subject,
        text,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Письмо отправлено:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Ошибка отправки:', error.message);
        throw new Error(`Не удалось отправить письмо: ${error.message}`);
    }
}