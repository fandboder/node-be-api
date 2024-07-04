const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Product = require('./product.model');

const Attribute = sequelize.define('Attribute', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'products',
            key: 'id'
        }
    },
    attributeName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    attributeValue: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'attributes',
    timestamps: false
});

Attribute.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = Attribute;
