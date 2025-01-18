const {sendEmail} = require('../services/emailService');
const {generateOTP} = require('../utils/generateOtp/generateOTP');
const OTP = require('../models/otp.model');
const User = require('../models/user.model');
const {hashOTP, compareOTP} = require('../utils/bcrypt/otpBcrypt');

const sendOTP = async (req, res, next) => {
  const {email} = req.body;

  if (!email) {
    return res.status(400).json({message: 'Email is required'});
  }

  try {
    const user = await User.findOne({email});
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    // Check if the user already has an OTP within the last minute
    const recentOtp = await OTP.findOne({userId: user._id}).sort({
      createdAt: -1,
    });
    if (recentOtp && (new Date() - new Date(recentOtp.createdAt)) / 60000 < 1) {
      return res.status(400).json({
        message:
          'OTP already sent recently. Please wait a minute before trying again.',
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Hash OTP before saving
    const hashedOtp = await hashOTP(otp);

    // Save OTP in database
    const otpRecord = new OTP({
      userId: user._id,
      otp: hashedOtp,
    });
    await otpRecord.save();

    const variables = {
      userName: user.firstName || 'user',
      otp: otp,
      expiryTime: '10 minutes',
      year: new Date().getFullYear(),
    };

    // Send OTP via email
    const subject = 'DevTinder: Your OTP for Email Verification';
    await sendEmail(email, subject, 'otp-email', variables);

    res
      .status(200)
      .json({message: 'OTP sent successfully. Please check your email.'});
  } catch (error) {
    next(error);
  }
};

const resendOTP = async (req, res, next) => {
  const {email} = req.body;

  if (!email) {
    return res.status(400).json({message: 'Email is required'});
  }

  try {
    const user = await User.findOne({email});
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    // Check if the user has a recent OTP (within 1 minute)
    const recentOtp = await OTP.findOne({userId: user._id}).sort({
      createdAt: -1,
    });

    if (recentOtp && new Date() - new Date(recentOtp.createdAt) < 60000) {
      return res.status(400).json({
        message: 'You can only request a new OTP after 1 minute.',
      });
    }

    // If OTP expired or not found, resend a new OTP
    const otp = generateOTP();

    // Hash OTP before saving
    const hashedOtp = await hashOTP(otp);

    // Save OTP in database
    const otpRecord = new OTP({
      userId: user._id,
      otp: hashedOtp,
    });
    await otpRecord.save();

    // Send OTP via email
    const subject = 'Your OTP for Email Verification';
    const text = `Your OTP is: ${otp}. It will expire in 10 minutes.`;
    await sendEmail(email, subject, text);

    res
      .status(200)
      .json({message: 'New OTP sent successfully. Please check your email.'});
  } catch (error) {
    next(error);
  }
};

const verifyOTP = async (req, res, next) => {
  const {email, otp} = req.body;

  if (!email || !otp) {
    return res.status(400).json({message: 'Email and OTP are required'});
  }

  try {
    const user = await User.findOne({email});
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    // Find the most recent OTP record for the user
    const otpRecord = await OTP.findOne({userId: user._id}).sort({
      createdAt: -1,
    });
    if (!otpRecord) {
      return res
        .status(404)
        .json({message: 'No OTP found for this user or OTP has expired'});
    }

    // Check if the OTP matches using the compareOTP function
    const isMatch = await compareOTP(otp, otpRecord.otp);
    if (!isMatch) {
      return res.status(400).json({message: 'Invalid OTP'});
    }

    user.isVerified = true;
    await user.save();

    // Optionally, delete the OTP record after successful verification
    await OTP.deleteOne({_id: otpRecord._id});

    res.status(200).json({message: 'OTP verified successfully'});
  } catch (error) {
    next(error);
  }
};

module.exports = {sendOTP, resendOTP, verifyOTP};
