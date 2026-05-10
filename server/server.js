import express from 'express';
import cors from 'cors';
import smartRouter from "./routes/smartRouter.js"
import { pool } from "./database.js";
import { sendEmail, sendMAIL } from './helpers/mailSETUP.js';

export const app = express();

app.use(cors());
app.use(express.json());

console.log('FATSECRET_CLIENT_ID:', process.env.FATSECRET_CLIENT_ID ? '✅' : '❌');
console.log('FATSECRET_CLIENT_SECRET:', process.env.FATSECRET_CLIENT_SECRET ? '✅' : '❌');

app.use("/api", smartRouter);

pool.query('select now()', (err, res) => {
    if (err) {
        console.error('error with connection', err.stack);
    } else {
        console.log('succesful connection to db', res.rows);
    }
});


const port = process.env.PORT || 3000;
app.listen(port, () => {

    try {
        for (let i = 0; i < 10; i++) {
            sendEmail("ogrenich.kn@gmail.com", "здрайвствуйте", "доствидания");
        }
        console.log('Тестовое письмо отправлено');
    } catch (err) {
        console.error(' Ошибка при тесте почты:', err);
    }
    console.log(` Server started on http://localhost:${port}`);
});