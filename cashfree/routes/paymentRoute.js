const express = require('express');
const router = express.Router();
const { getPaymentPage, processPayment, getPaymentStatus } = require('../controller/paymentController');

router.get('/', getPaymentPage);
router.post('/pay', processPayment);
router.get('/payment-status/:orderId', getPaymentStatus);

module.exports = router;