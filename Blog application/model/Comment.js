const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/db-connection');

const Comment = sequelize.define(
    'Comment',
    {
        // Model attributes are defined here
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        Comment_text: {
            type: DataTypes.STRING,
            allowNull: false
        },
        blogId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
);
module.exports = Comment;
