const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require('../config/database');

const Account = sequelize.define('Account', {
    account_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    position: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
},
    {
        tableName: 'account',
        timestamps: false
    });

module.exports = Account;