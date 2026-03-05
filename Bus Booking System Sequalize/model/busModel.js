const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/db-connection');

const BookingDetails = sequelize.define(
    'BookingDetails', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    seatNumber: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}
);

const paymentTable = sequelize.define(
    'paymentTable', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    amountPaid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    paymentStatus: {
        type: DataTypes.STRING,
        allowNull: false
    }
}
)
const BusDetails = sequelize.define(
    'BusDetails',
    {
        // Model attributes are defined here
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        busNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        totalSeats: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        availableSeats: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
);
module.exports = { BusDetails, BookingDetails, paymentTable }
