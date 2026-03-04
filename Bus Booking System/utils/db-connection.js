const mysql = require('mysql2')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Urp!1456',
    database: 'testdb'
})

connection.connect((err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log("Connection has been created");

    const creationUserTable = `create table IF NOT EXISTS Users(
        id INT AUTO_INCREMENT PRIMARY KEY,
        name varchar(50),
        email varchar(50)
    )`

    const createBusesTable = `create table IF NOT EXISTS BusDetails(
        id INT AUTO_INCREMENT PRIMARY KEY,
        busNumber INT,
        totalSeats INT,
        availableSeats INT
    )`

    const bookingTable = `create table IF NOT EXISTS BookingDetails(
        id INT AUTO_INCREMENT PRIMARY KEY,
        seatNumber INT
    )`

    const paymentTable = `create table IF NOT EXISTS PaymentDetails(
        id INT AUTO_INCREMENT PRIMARY KEY,
        amountPaid INT,
        paymentStatus varchar(10)
    )`

    connection.execute(creationUserTable, (err) => {
        if (err) console.log("Users table error:", err);
    });

    connection.execute(createBusesTable, (err) => {
        if (err) console.log("BusDetails table error:", err);
    });

    connection.execute(bookingTable, (err) => {
        if (err) console.log("BookingDetails table error:", err);
    });

    connection.execute(paymentTable, (err) => {
        if (err) console.log("PaymentDetails table error:", err);
    });

    console.log("Tables checked/created successfully");

})

module.exports = connection;