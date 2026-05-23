import { pool } from '../database.js';
import bcrypt from 'bcrypt';
import { getRandomNum } from '../helpers/random.js';
import { sendEmail } from '../helpers/mailSETUP.js';

export async function addUser(req, res) {
    try {
        const { email, username, password } = req.body;

        if (!email || !password || !username) {
            return res.status(400).json({ message: 'Email, пароль и username обязательны' });
        }

        const { rows } = await pool.query(
            "SELECT EXISTS(SELECT 1 FROM users WHERE email = $1);",
            [email]
        );

        if (rows[0].exists) {
            return res.status(409).json({ message: "Такой пользователь уже существует" });
        }


        const hashedPass = await bcrypt.hash(password, 10);

        const result = await pool.query(
            "INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3) RETURNING id",
            [email, username, hashedPass]
        );

        req.session.email = email;
        req.session.name = username;
        req.session.userId = result.rows[0].id;

        await getCode(req, res);

    } catch (err) {
        console.error("Ошибка addUser:", err);
        res.status(500).json({ message: err.message });
    }
}

export async function loginUser(req, res) {
    try {
        const { email, username, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email и пароль обязательны' });
        }

        const { rows } = await pool.query(
            "SELECT * FROM users WHERE email = $1 LIMIT 1;",
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: "Пользователь не найден" });
        }

        const user = rows[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: 'Неверный пароль' });
        }

        req.session.email = user.email;
        req.session.name = user.username;
        req.session.userId = user.id;

        await getCode(req, res);

    } catch (err) {
        console.error("Ошибка loginUser:", err);
        res.status(500).json({ message: err.message });
    }
}

export async function getCode(req, res) {
    try {
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += getRandomNum().toString();
        }

        req.session.verifCode = code;

        sendEmail(req.session.email, "Подтверждение входа в аккаунт FoodTracker", code);

        return res.status(200).json({ message: 'correct' })

    } catch (error) {
        console.error("Ошибка getCode:", error);
        return res.status(400).json({ message: `Ошибка отправки кода: ${error.message}` });
    }
}

export function checkCode(req, res) {
    if (!req.session.verifCode) {
        return res.status(400).json({ message: 'Код не найден, войдите заново' });
    }

    if (req.query.code === req.session.verifCode) {
        req.session.isLoged = true;
        req.session.verifCode = req.query.code;
        return res.status(200).json({ message: 'correct code' });
    } else {
        req.session.isLoged = false;
        return res.status(401).json({ message: 'Неверный код' });
    }
}

export function checkAuth(req, res) {
    if (req.session.isLoged === true) {
        console.log('session:', req.session);
        return res.status(200).json({
            authorized: true,
            email: req.session.email,
            username: req.session.name
        });
    } else {
        return res.status(401).json({
            authorized: false,
            message: 'user is not loged in'
        });
    }
}

export function logoutUser(req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Logout failed' });
        }

        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Logged out' });
    });
}