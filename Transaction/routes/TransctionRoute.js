const express = require('express');
const router = express.Router();
const { createUser, transferFunds } = require('../controller/transcationController');

// Route for creating a user
router.post('/users', createUser);

// Route for transferring funds
router.post('/transfer', transferFunds);

module.exports = router;