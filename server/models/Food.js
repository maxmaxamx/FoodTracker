import { DataTypes } from "sequelize";
import Sequelize from "sequelize";

const Food = Sequelize.define(
    "Food",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
        calories: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false
        },
        proteins: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false
        },
        fats: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false
        },
        carbs: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false
        },
        userID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Users",
                key: "id",
            },
            onDelete: "CASCADE"
        },
        intakeTime: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    { timestamps: true }
)