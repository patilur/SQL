const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('testdb', 'root', 'Urp!1456', {
    host: 'localhost',
    dialect: 'mysql'
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

module.exports=sequelize;

// const mysql = require('mysql2')
// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'Urp!1456',
//     database: 'testdb'
// })

// connection.connect((err) => {
//     if (err) {
//         console.log(err);
//         return;
//     }
//     console.log("Connection has been created");

//     const creationQuery = `create table if not exists students(
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         name varchar(20),
//         email varchar(20)
//     )`

//     connection.execute(creationQuery, (err) => {
//         if (err) {
//             console.log(err);
//             connection.end();
//             return;
//         }
//         console.log("Table is created");
//     })
// })

// module.exports = connection;