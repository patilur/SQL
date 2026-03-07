const User = require('./userModel');
const Bus = require('./busModel');
const Booking = require('./bookingModel');

// User → Booking
User.hasMany(Booking);
Booking.belongsTo(User);

// Bus → Booking
Bus.hasMany(Booking);
Booking.belongsTo(Bus);

module.exports = {
    User,
    Bus,
    Booking
};