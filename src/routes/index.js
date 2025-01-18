const express = require('express');
const authRoutes = require('./auth.routes');
const otpRoutes = require('./otp.routes');
const userRouter = require('./user.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/otp', otpRoutes);
router.use('/profile', userRouter);

module.exports = router;
