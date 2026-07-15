import session from "express-session";
import { pool } from "../database.js";
import { Food } from "../models/index.js";
import { Op } from "sequelize";


function getIntakeCategory(date) {
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) return "Breakfast";
    if (hour >= 12 && hour < 17) return "Lunch";
    if (hour >= 17 && hour < 22) return "Dinner";
    return "Snack";
}

export async function pushFood(req, res) {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Неавторизованный доступ" });
    }

    const { Name, Calories, Fats, Carbs, Proteins, Intake, date } = req.body;

    if (!Name || !date || !Intake) {
        return res.status(400).json({ message: "Не хватает обязательных полей" });
    }

    const timeMap = {
        'Breakfast': '08:00:00',
        'Lunch': '13:00:00',
        'Dinner': '19:00:00',
        'Snack': '16:00:00'
    };

    const timeStr = timeMap[Intake] || '12:00:00';
    const intakeTime = new Date(`${date}T${timeStr}Z`);

    if (isNaN(intakeTime.getTime())) {
        return res.status(400).json({ message: "Некорректный формат даты" });
    }

    try {
        const result = await Food.create({
            userId: req.session.userId,
            name: Name,
            calories: Calories,
            proteins: Proteins,
            fats: Fats,
            carbs: Carbs,
            intakeTime: intakeTime
        });

        return res.status(201).json({ id: result.id });
    } catch (error) {
        console.error("Ошибка в добавлении еды:", error);
        return res.status(500).json({ message: "Ошибка в добавлении еды" });
    }
}

export async function getFood(req, res) {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Неавторизованный доступ" });
    }

    if (!req.query.date) {
        return res.status(400).json({ message: "Нету даты" });
    }

    const targetDate = new Date(req.query.date);
    if (isNaN(targetDate.getTime())) {
        return res.status(400).json({ message: "Некорректный формат даты" });
    }

    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const startOfNextDay = new Date(targetDate);
    startOfNextDay.setDate(startOfNextDay.getDate() + 1);

    try {
        const foods = await Food.findAll({
            where: {
                userId: req.session.userId,
                intakeTime: {
                    [Op.gte]: startOfDay,
                    [Op.lt]: startOfNextDay
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
            Intake: getIntakeCategory(r.intakeTime)
        }));

        return res.status(200).json(foodArr);
    } catch (error) {
        console.error("Ошибка в получении еды:", error);
        return res.status(500).json({ message: "Ошибка в получении еды" });
    }
}

export async function deleteFood(req, res) {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Неавторизованный доступ" });
    }

    const foodId = parseInt(req.params.id);

    if (isNaN(foodId)) {
        return res.status(400).json({ message: "Некорректный ID" });
    }

    try {
        const deletedCount = await Food.destroy({
            where: {
                id: foodId,
                userId: req.session.userId
            }
        });

        if (deletedCount === 0) {
            return res.status(404).json({ message: "Запись не найдена" });
        }

        return res.status(200).json({ message: "Успешно удалено" });
    } catch (error) {
        console.error("Ошибка при удалении еды:", error);
        return res.status(500).json({ message: "Ошибка при удалении еды" });
    }
}