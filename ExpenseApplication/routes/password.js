const express = require('express');
const router = express.Router();
const passwordController = require('../controller/password');

router.post('/forgotpassword', passwordController.forgotPassword);
router.get('/resetpassword/:token', passwordController.getResetPasswordPage);
router.post('/updatepassword/:token', passwordController.updatePassword);

module.exports = router;