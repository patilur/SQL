const express = require('express');
const router = express.Router();
const expenseController = require('../controller/expenseConroller')


router.post('/addExpense', expenseController.addExpense)
router.get('/getExpense', expenseController.getExpense)
router.put('/edit/:id', expenseController.editExpense);
router.delete('/delete/:id', expenseController.deleteExpense);


module.exports = router;