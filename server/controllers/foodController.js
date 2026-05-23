import session from "express-session";
import { pool } from "../database.js";

export async function pushFood(req, res) {
    try {
        const {
            Name,
            Calories,
            Fats,
            Carbs,
            Proteins,
            Intake,
            date
        } = req.body;


        const result = await pool.query(
            `INSERT INTO food (name, carbs, fats, proteins, calories, connect_id, food_intake, date_added) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id
            `,
            [Name, Carbs, Fats, Proteins, Calories, req.session.userId, Intake, date]
        )

        return res.status(201).json({ id: result.rows[0].id });
    } catch (error) {
        return res.status(401).json({ message: "Ошибка" + error.message });
    }
}

export async function getFood(req, res) {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Неавторизованный доступ" });
    }

    if (!req.query.date) {
        return res.status(401).json({ message: "Нету даты" });
    }

    try {
        const { rows } = await pool.query(
            `SELECT * FROM food WHERE connect_id=$1 AND date_added::date=$2::date
            `, [req.session.userId, req.query.date])

        const foodArr = rows.map(r => ({
            Id: r.id,
            Name: r.name,
            Calories: Number(r.calories),
            Fats: Number(r.fats),
            Carbs: Number(r.carbs),
            Proteins: Number(r.proteins),
            Intake: r.food_intake
        }));

        return res.status(200).json(foodArr);
    } catch (error) {
        return res.status(500).json({ message: "Ошибка в получении еды" + error.message })
    }
}

export async function deleteFood(req, res) {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Неавторизованный доступ" });
    }

    try {
        const { rows } = await pool.query(
            `DELETE FROM food WHERE ID = $1
            `, [req.params.id])

        const foodArr = rows.map(r => ({
            Id: r.id,
            Name: r.name,
            Calories: Number(r.calories),
            Fats: Number(r.fats),
            Carbs: Number(r.carbs),
            Proteins: Number(r.proteins),
            Intake: r.food_intake
        }));

        return res.status(200).json('Успешно удалено');
    } catch (error) {
        return res.status(500).json({ message: "Ошибка в получении еды" + error.message })
    }
}