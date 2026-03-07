const Booking = require('../model/bookingModel');

const createBooking = async (req, res) => {

    const { userId, busId, seatNumber } = req.body;

    const booking = await Booking.create({
        userId,
        busId,
        seatNumber
    });

    res.json(booking);
}

module.exports = { createBooking };