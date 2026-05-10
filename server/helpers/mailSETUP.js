import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../.env') });

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

export function sendEmail(to, subject, text) {
    mailOptions = {
        from: process.env.GMAIL_USER,
        to,
        subject,
        text,
    };

    try {
        let mailInfo = ''; 
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) return console.log(error);
            console.log('Email sent: ' + info.response);
            mailInfo = info;
        });
        console.log('✅ Письмо отправлено:', mailInfo.messageId);
        return { success: true, messageId: mailInfo.messageId };
    } catch (error) {
        console.error('❌ Ошибка отправки:', error.message);
        throw new Error(`Не удалось отправить письмо: ${error.message}`);
    }
}

let mailOptions = {
    from: 'maximnovitskiy274@gmail.com',
    to: 'novitskiymaxim08@gmail.com',
    subject: 'Тест OAuth2',
    text: 'Это письмо отправлено через OAuth2!'
};

export function sendMAIL() {
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) return console.log(error);
        console.log('Email sent: ' + info.response);

        return info.response;
    });
}
