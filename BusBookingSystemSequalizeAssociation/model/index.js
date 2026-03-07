const User = require('./userModel');
const Bus = require('./busModel');
const Booking = require('./bookingModel');

User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

Bus.hasMany(Booking, { foreignKey: 'busId' });
Booking.belongsTo(Bus, { foreignKey: 'busId' });

module.exports = { User, Bus, Booking };