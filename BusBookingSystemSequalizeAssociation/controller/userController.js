//const connection = require('../utils/db-connection');
const db = require('../utils/db-connection');
const User = require('../model/userModel');
const Booking = require('../model/bookingModel');
const Bus = require('../model/busModel');

const getUserBookings = async (req, res) => {

    const userId = req.params.id;
    //SELECT b.id,b.seatNumber,bus.busNumber
    //FROM Bookings b JOIN Buses bus 
    //ON b.busId = bus.id WHERE b.userId = ?;
    const bookings = await Booking.findAll({
        where: { userId: userId },
        attributes: ['id', 'seatNumber'],
        include: [
            {
                model: Bus,
                attributes: ['busNumber']
            }
        ]
    });

    res.json(bookings);
}


const addEntries = async (req, res) => {
    const { name, email } = req.body;
    //const { email, name } = req.body;
    try {
        const user = await User.create({
            name: name,
            email: email
        })
        res.status(201).json(user);
    } catch (err) {
        res.status(500).send('Unable to make entry');
    }
}
const getEntry = async (req, res) => {
    try {
        const users = await User.findAll();
        if (users.length === 0) {
            return res.status(404).send("User is not found");
        }

        res.status(200).json(users);
    }
    catch (err) {
        res.status(500).send('Unable to find users');
    }
}


module.exports = { addEntries, getEntry, getUserBookings }
