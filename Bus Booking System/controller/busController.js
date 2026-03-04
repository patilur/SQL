/**
 POST /buses → Add a new bus.
GET /buses/available/:seats → Retrieve all buses with more than the specified number of available seats.
create table IF NOT EXISTS BusDetails(
        id INT AUTO_INCREMENT PRIMARY KEY,
        busNumber INT,
        totalSeats INT,
        availableSeats INT
 */
const db = require('../utils/db-connection');


const addBus = (req, res) => {
    const { busno, totalseats, availableseats } = req.body;
    const insertQuery = 'Insert into BusDetails (busNumber, totalSeats, availableSeats) values (?,?,?)'

    db.execute(insertQuery, [busno, totalseats, availableseats], (err, result) => {
        if (err) {
            console.log(err.message)
            return res.status(500).json({ error: err.message });
        }

        res.status(201).json({
            message: `Bus ${busno} successfully added`,
            busId: result.insertId
        });
    })
}
const getBus = (req, res) => {
    const seats = parseInt(req.params.seats)
    const getQuery = 'select * from BusDetails where availableSeats>?';

    db.execute(getQuery, [seats], (err, result) => {
        if (err) {
            console.log(err.message);
            return res.status(500).json({ error: err.message });
        }

        res.status(200).json({
            message: "Successfully fetched bus list",
            data: result
        });
    })
}

module.exports = {
    addBus, getBus
}