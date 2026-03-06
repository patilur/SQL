const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/db-connection');

const Users = sequelize.define(
    'Users',
    {
        // Model attributes are defined here
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phoneno: {
            type: DataTypes.STRING,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            unique: true
            // allowNull defaults to true
        },
    },
);
module.exports = Users;
