const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/db-connection');

const Blog = sequelize.define(
    'Blog',
    {
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
        },
    },
);
module.exports = Blog;
