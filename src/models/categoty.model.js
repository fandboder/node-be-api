const { Sequelize, DataTypes } = require("sequelize")
const { sequelize } = require('../config/database')
const Menu = require('./menu.model')

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE(3),
        allowNull: true
    },
    updated_at: {
        type: DataTypes.DATE(3),
        allowNull: true
    },
    menu_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'categories',
    timestamps: false,
});

Category.belongsTo(Menu, { foreignKey: 'menu_id' });

module.exports = Category;