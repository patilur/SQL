const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/db-connection');

const Expense = sequelize.define(
    'Expense',
    {
        // Model attributes are defined here
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        expenseamount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false
            // allowNull defaults to true
        },
        type: {
            type: Sequelize.ENUM('income', 'expense'),
            allowNull: false,
            defaultValue: 'expense'
        }
    },
);
module.exports = Expense;
