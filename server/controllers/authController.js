import axios from 'axios';
import { pool } from '../database.js';
import PG from 'pg';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { getRandomNum } from '../helpers/random.js';
import session from 'express-session';
import { sendEmail } from '../helpers/mailSETUP.js';

export async function addUser(req, res) {
    try {
        const { name, password, username } = req.body;

        if (!name || !password) {
            return res.status(400).json({ error: 'Имя и пароль обязательны' });
        }

        const hashedPass = await bcrypt.hash(password, 10);

        const { rows } = await pool.query("SELECT EXISTS(SELECT 1 FROM users WHERE name = $1 LIMIT 1);", [name])

        if (rows.length > 0) {
            return res.status(409).json({ error: "такой пользователь уже существует" });
        }

        const result = await pool.query("INSERT INTO users ($1, $2, $3) VALUES ($1, $2, $3) RETURNING id", [name, hashedPass, username]);

        session.email = username;

        return res.status(201).json({
            message: "Пользователь создан",
            user: result.rows[0]
        })
    } catch (err) {
        console.log("Ощибка: ", err);
        return res.status(500).json({ message: err });
    }
}

export async function loginUser(req, res) {
    try {
        const { name, username, password } = req.body;

        if (!name || !password) {
            return res.status(400).json({ error: 'Имя и пароль обязательны' });
        }

        const hashedPass = await bcrypt.hash(password, 10);

        const { rows } = await pool.query("SELECT EXISTS(SELECT 1 FROM users WHERE name = $1 LIMIT 1);", [name])

        if (rows.length < 0) {
            return res.status(409).json({ error: "такого пользователя не существует" });
        }

        const user = rows[0];

        const isMatch = (hashedPass === user.password);

        if (isMatch) {
            session.email = username;

            await getCode(req,res);;

            return res.status(201).json({
                message: "пользователь найден",
                user: result.rows[0]
            })
        } else {
            return res.status(400).json({ error: 'Неправильный пароль' });
        }


    } catch (err) {
        console.log("Ощибка: ", err);
        res.status(500).json({ message: err });
    }
}

export async function getCode(req, res) {
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += getRandomNum().toLocaleString;
    }
    session.verifCode = code;

    try {
        sendEmail(session.email, "Подтверждение входа в аккаунт FoodTracker", code);
        return res.status(200).json({ message: 'correct' });
    } catch (error) {
        return res.status(400).json({ message: `smth is incorrect: ${error.message}` })
    }
}

export function checkCode(req, res) {
    if (req.query.code === session.verifCode) {
        session.isLoged = true;
        return res.status(200).json({ message: 'correct code' });
    } else if (req.query.code != session.verifCode) {
        session.isLoged = false;
        return res.status(401).json({ message: 'code is incorrect' });
    }
}