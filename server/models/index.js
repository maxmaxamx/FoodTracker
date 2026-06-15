// models/index.js
import User from './User.js';
import Food from './Food.js';

// Связи между моделями
User.hasMany(Food, { foreignKey: 'userId' });
Food.belongsTo(User, { foreignKey: 'userId' });

const db = { User, Food };

export default db;