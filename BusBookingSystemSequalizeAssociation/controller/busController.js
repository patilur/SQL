const Bus = require('../model/busModel');
const { Op } = require('sequelize');
const Booking = require('../model/bookingModel');
const User = require('../model/userModel');


const getBusBookings = async (req, res) => {
    try {

        const busId = req.params.id;

        //SELECT b.id,b.seatNumber,u.name,u.email 
        //FROM Bookings b JOIN Users u
        //ON b.userId = u.id WHERE b.busId = ?;
        const bookings = await Booking.findAll({
            where: { busId: busId },
            attributes: ['id', 'seatNumber'],
            include: [
                {
                    model: User,
                    attributes: ['name', 'email']
                }
            ]
        });

        res.status(200).json(bookings);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching bookings" });
    }
};





const addBus = async (req, res) => {

    try {

        const { busno, totalseats, availableseats } = req.body;

        const bus = await Bus.create({
            busNumber: busno,
            totalSeats: totalseats,
            availableSeats: availableseats
        });

        res.status(201).json(bus);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}


const getBus = async (req, res) => {

    try {

        const seats = parseInt(req.params.seats);

        //SELECT * FROM Buses WHERE availableSeats > ?
        const buses = await Bus.findAll({
            where: {
                availableSeats: {
                    [Op.gt]: seats
                }
            }
        });

        if (buses.length === 0) {
            return res.status(404).json({
                message: "No buses found"
            });
        }

        res.status(200).json({
            message: "Successfully fetched bus list",
            data: buses
        });

    } catch (error) {
        console.log(error);
        res.status(500).send('Error encountered while fetching buses.');
    }
}

module.exports = {
    addBus,
    getBus,
    getBusBookings

}