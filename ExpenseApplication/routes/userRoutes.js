const express = require('express');
const router = express.Router();
const userController = require('../controller/userController')

router.post('/addUser', userController.addEntries)

module.exports = router;