const express = require('express');
const router = express.Router();
const busBookingContoller = require('../controller/busBookingController');

router.post('/booking', busBookingContoller.createBooking);


module.exports = router;