import sequelize from '../database.js';
import User from './User.js';
import Food from './Food.js';

User.hasMany(Food, {
    foreignKey: 'userId',
    as: 'foods',
    onDelete: 'CASCADE',
});

Food.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
});

export { sequelize, User, Food };