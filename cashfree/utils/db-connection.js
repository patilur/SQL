const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('cashfree', 'root', 'Urp!1456', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

sequelize.authenticate()
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch(err => {
        console.error("Database connection error:", err);
    });

module.exports = sequelize;