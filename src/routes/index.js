const express = require('express');
const authRoutes = require('./auth.routes');
const otpRoutes = require('./otp.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/otp', otpRoutes);

module.exports = router;
