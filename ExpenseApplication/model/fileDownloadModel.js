const Sequelize = require('sequelize');
const db = require('../utils/db-connection');

const FileDownload = db.define('filedownload', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    fileURL: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = FileDownload;