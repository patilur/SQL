const express = require('express');
const router = express.Router();
const busController = require('../controller/busController')


router.post('/addBus', busController.addBus)
router.get('/available/:seats', busController.getBus)


module.exports = router;