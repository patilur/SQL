const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('bankingtransaction', 'root', 'Urp!1456', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;