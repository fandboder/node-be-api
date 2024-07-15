const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Product = require('../models/product.model');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    note: {
        type: DataTypes.STRING(200),
        allowNull: true
    }
}, {
    tableName: 'orders',
    timestamps: false
});


module.exports = Order;
