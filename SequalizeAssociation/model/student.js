const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/db-connection');

const Students = sequelize.define(
    'Students',
    {
        // Model attributes are defined here
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
            // allowNull defaults to true
        },
    },
);
module.exports=Students;
