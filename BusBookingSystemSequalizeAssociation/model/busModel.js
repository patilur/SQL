const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db-connection');

const Bus = sequelize.define('Bus', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    busNumber: {
        type: DataTypes.STRING
    },
    totalSeats: {
        type: DataTypes.INTEGER
    },
    availableSeats: {
        type: DataTypes.INTEGER
    }
});

module.exports = Bus;