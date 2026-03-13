/**
 POST /buses → Add a new bus.
GET /buses/available/:seats → Retrieve all buses with more than the specified number of available seats.
create table IF NOT EXISTS BusDetails(
        id INT AUTO_INCREMENT PRIMARY KEY,
        busNumber INT,
        totalSeats INT,
        availableSeats INT
 */
const { BusDetails, BookingDetails, paymentTable } = require('../model/busModel');
const db = require('../utils/db-connection');
const { Op } = require('sequelize');

const addBus = async (req, res) => {
    const { busno, totalseats, availableseats } = req.body;
    try {
        const bus = await BusDetails.create({
            busNumber: busno,
            totalSeats: totalseats,
            availableSeats: availableseats
        })
        res.status(201).send(`Bus ${busno} successfully added`)
    } catch (err) {
        res.status(500).send('Unable to add bus');
    }
}
const getBus = async (req, res) => {


    try {
        const { seats } = req.params;

        const getBuses = await BusDetails.findAll({
            where: {
                availableSeats: {
                    [Op.gt]: seats
                }
            }
        });
        if (getBuses.length === 0) {
            return res.status(404).send("No buses found");
        }
        res.status(200).json({
            message: "Successfully fetched bus list",
            data: getBuses
        })

    } catch (error) {
        console.log(error);
        res.status(500).send('Error encountered while deleting.');
    }
}


module.exports = {
    addBus, getBus
}