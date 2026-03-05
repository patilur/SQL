const express = require('express');
const router = express.Router();
const userController = require('../controller/userController')


router.post('/addUser', userController.addEntries)
router.get('/getUsers', userController.getEntry)
router.put('/update/:id', userController.updateEntry);
router.delete('/delete/:id', userController.deleteEntry);


module.exports = router;