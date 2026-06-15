import { DataTypes } from 'sequelize';

const Food = (sequelize, DataTypes) => {
    const Food = sequelize.define('Food', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        intakeTime: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    }, {
        tableName: 'foods',
        timestamps: true,
        underscored: true,
    });

    Food.associate = (models) => {
        Food.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user',
        });
    };

    return Food;
};

export default Food;