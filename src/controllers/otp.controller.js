const {sendEmail} = require('../services/emailService');
const {generateOTP} = require('../utils/generateOtp/generateOTP');
const OTP = require('../models/otp.model');
const User = require('../models/user.model');
const {hashOTP, compareOTP} = require('../utils/bcrypt/otpBcrypt');
const {hashPassword} = require('../utils/bcrypt/passwordBcrypt');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('../utils/jwtTokens/jwt');
const parseTimeInSec = require('../utils/parseTime/parseTimeInSec');
const {saveToken} = require('../services/tokenService');

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
  const {firstName, lastName, password, gender, email, otp} = req.body;

  const missingFields = [
    'firstName',
    'password',
    'gender',
    'email',
    'otp',
  ].filter((field) => !req.body[field]);

  if (missingFields.length) {
    return res
      .status(400)
      .json({message: `Missing fields: ${missingFields.join(', ')}`});
  }

  try {
    // Find the most recent OTP record for the user
    const otpRecord = await OTP.findOne({email}).sort({createdAt: -1});
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

    const hashedPassword = await hashPassword(password);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      gender,
      isVerified: true,
    });
    await user.save();

    // Optionally, delete the OTP record after successful verification
    await OTP.deleteOne({_id: otpRecord._id});

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    const accessTokenExpiry = parseTimeInSec(process.env.ACCESS_TOKEN_EXPIRY);
    const refreshTokenExpiry = parseTimeInSec(process.env.REFRESH_TOKEN_EXPIRY);

    await saveToken(user._id, accessToken, 'access', accessTokenExpiry);
    await saveToken(user._id, refreshToken, 'refresh', refreshTokenExpiry);

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: process.env.COOKIE_MAX_AGE,
      path: '/',
    });

    res.status(200).json({
      name: firstName,
      message: 'OTP verified successfully. User created.',
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {sendOTP, resendOTP, verifyOTP};
