const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db-connection');

const Order = sequelize.define('order', {
    orderId: { type: DataTypes.STRING, unique: true },
    userId: DataTypes.INTEGER,
    amount: DataTypes.FLOAT,
    currency: { type: DataTypes.STRING, defaultValue: "INR" },
    status: { type: DataTypes.STRING, defaultValue: "PENDING" } // PENDING / SUCCESS / FAILED
});

module.exports = Order;