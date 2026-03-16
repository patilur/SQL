const express = require('express');
const router = express.Router();
const paymentController = require('../controller/paymentController');

// Import your existing authentication middleware
const userMiddleware = require('../middleware/auth');

// 1. Show Payment Page (Optional if you are using the modal on the main page)
router.get('/', paymentController.getPaymentPage);

// 2. Create Order - Must be authenticated to get req.user.id
router.post('/pay', userMiddleware.authenticate, paymentController.processPayment);

// 3. Verify Status - Must be authenticated to update the specific user's premium status
router.get('/payment-status/:orderId', userMiddleware.authenticate, paymentController.getPaymentStatus);

module.exports = router;