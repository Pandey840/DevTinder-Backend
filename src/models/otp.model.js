const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This references the 'User' model
    required: [true, 'User ID is required for OTP validation'],
  },
  otp: {type: String, required: true},
  createdAt: {
    type: Date,
    default: Date.now,
    expires: `${process.env.OTP_EXPIRY_MINUTES}m`,
  },
});

module.exports = mongoose.model('OTP', otpSchema);
