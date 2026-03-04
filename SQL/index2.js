const express = require('express');
const mysql = require('mysql2')
const app = express();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Urp!1456',
    database: 'busbooking'
})

connection.connect((err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log("Connection has been created");

    const creationUserTable = `create table Users(
        id INT AUTO_INCREMENT PRIMARY KEY,
        name varchar(50),
        email varchar(50)
    )`

    const createBusesTable = `create table BusDetails(
        id INT AUTO_INCREMENT PRIMARY KEY,
        busNumber INT,
        totalSeats INT,
        availableSeats INT
    )`

    const bookingTable = `create table BookingDetails(
        id INT AUTO_INCREMENT PRIMARY KEY,
        seatNumber INT
    )`

    const paymentTable = `create table PaymentDetails(
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

app.get('/', (req, res) => {
    res.send('Hello world')
})

app.listen(3000, (err) => {
    console.log('Server running')
})
