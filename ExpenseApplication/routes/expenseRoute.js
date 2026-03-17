const express = require('express');
const router = express.Router();
const expenseController = require('../controller/expenseController')
const userAuthenticate = require('../middleware/auth')


router.post('/addExpense', userAuthenticate.authenticate, expenseController.addExpense)
router.get('/getExpense', userAuthenticate.authenticate, expenseController.getExpense)
router.put('/edit/:id', userAuthenticate.authenticate, expenseController.editExpense);
router.delete('/delete/:id', userAuthenticate.authenticate, expenseController.deleteExpense);


module.exports = router;