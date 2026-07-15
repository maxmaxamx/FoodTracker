import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

const Food = sequelize.define('Food', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    calories: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    proteins: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    fats: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    carbs: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    intakeTime: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW, 
    },
}, {
    tableName: 'foods',
    timestamps: true,
    underscored: true,
});

export default Food;