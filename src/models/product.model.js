const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Category = require('./categoty.model');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
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
    category_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'categories',
            key: 'id'
        }
    }
}, {
    tableName: 'products',
    timestamps: false
});

Product.belongsTo(Category, { foreignKey: 'category_id' });

module.exports = Product;
