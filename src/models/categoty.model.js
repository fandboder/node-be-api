const { Sequelize, DataTypes } = require("sequelize")
const { sequelize } = require('../config/database')

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
    menu_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'categories',
    timestamps: false
});

module.exports = Category;