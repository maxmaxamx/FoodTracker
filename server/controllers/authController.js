import axios from 'axios';
import { pool } from '../database.js';
import PG from 'pg';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

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
            return res.status(409).json({ error: "такой пользователь не существует" });
        }

        const user = rows[0];

        const isMatch = (hashedPass === user.password);

        if (isMatch) {
            return res.status(201).json({
                message: "Пользователь создан",
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

export async function twoFA(req, res) {

}