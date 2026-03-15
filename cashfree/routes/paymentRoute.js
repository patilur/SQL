const express = require('express');
const router = express.Router();
const { getPaymentPage, processPayment, getPaymentStatus } = require('../controller/paymentController');

router.get('/', getPaymentPage);                        // Serve frontend page
router.post('/pay', processPayment);                    // Create order
router.get('/payment-status/:paymentSessionId', getPaymentStatus); // Check status

module.exports = router;