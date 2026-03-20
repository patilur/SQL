const genController = require('../controller/genAIController');
const express = require('express');
const router = express.Router();
const userAuthenticate = require('../middleware/auth');

router.post('/category', genController.genCategory);
console.log("routes working")
module.exports = router;