const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/db-connection');

const Blog = sequelize.define(
    'Blog',
    {
        // Model attributes are defined here
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        blogTitle: {
            type: DataTypes.STRING,
            allowNull: false
        },
        blogAuthor: {
            type: DataTypes.STRING,
            allowNull: false
        },
        blogContent: {
            type: DataTypes.TEXT,
            allowNull: false
            // allowNull defaults to true
        },
    },
);
module.exports = Blog;
