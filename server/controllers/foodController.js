import session from "express-session";
import { pool } from "../database.js";
import { Food } from "../models/index.js";
import { Op } from "sequelize";

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



        const result = await Food.create({
            userId: req.session.userId,
            name: Name,
            calories: Calories,
            proteins: Proteins,
            fats: Fats,
            carbs: Carbs,
            intakeTime: Intake
        })



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
        return res.status(400).json({ message: "Нету даты" });
    }

    try {
        const foods = await Food.findAll({
            where: {
                userId: req.session.userId,
                intakeTime: {
                    [Op.like]: `${req.query.date}%`
                }
            },
            order: [['intakeTime', 'ASC']]
        });

        const foodArr = foods.map(r => ({
            Id: r.id,
            Name: r.name,
            Calories: Number(r.calories),
            Fats: Number(r.fats),
            Carbs: Number(r.carbs),
            Proteins: Number(r.proteins),
            Intake: r.intakeTime
        }));

        return res.status(200).json(foodArr);
    } catch (error) {
        return res.status(500).json({ message: "Ошибка в получении еды: " + error.message });
    }
}

export async function deleteFood(req, res) {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Неавторизованный доступ" });
    }

    try {
        const foodId = parseInt(req.params.id);
        
        if (isNaN(foodId)) {
            return res.status(400).json({ message: "Некорректный ID" });
        }

        const food = await Food.findOne({
            where: {
                id: foodId,
                userId: req.session.userId
            }
        });

        if (!food) {
            return res.status(404).json({ message: "Запись не найдена" });
        }

        const deletedCount = await Food.destroy({
            where: {
                id: foodId,
                userId: req.session.userId
            }
        });

        if (deletedCount === 0) {
            return res.status(500).json({ message: "Не удалось удалить запись" });
        }

        return res.status(200).json({ message: "Успешно удалено" });
    } catch (error) {
        return res.status(500).json({ message: "Ошибка при удалении еды: " + error.message });
    }
}