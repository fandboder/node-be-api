const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
    product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    category_id: {
        type: DataTypes.INTEGER
    },
    img: {
        type: DataTypes.STRING
    }
},
    {
        tableName: 'products',
        timestamps: false
    });

module.exports = Product;
