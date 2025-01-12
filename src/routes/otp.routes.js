const express = require('express');
const {
  sendOTP,
  resendOTP,
  verifyOTP,
} = require('../controllers/otp.controller');

const otpRouter = express.Router();

otpRouter.post('/send', sendOTP);
otpRouter.post('/resend', resendOTP);
otpRouter.post('/verify', verifyOTP);

module.exports = otpRouter;
