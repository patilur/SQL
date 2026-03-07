const express = require('express');
const router = express.Router();
const studentController = require('../controller/userController')


router.post('/addUser', studentController.addEntries)
router.get('/getUsers', studentController.getEntry)
router.get('/:id/bookings', studentController.getUserBookings);

module.exports = router;