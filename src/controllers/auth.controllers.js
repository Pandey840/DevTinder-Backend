const {
  hashPassword,
  comparePassword,
} = require('../utils/bcrypt/passwordBcrypt');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('../utils/jwtTokens/jwt');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const {user: userMessages} = require('../utils/messages');

const signUp = async (req, res, next) => {
  const {firstName, lastName, email, password, gender} = req.body;

  if (!firstName || !email || !password || !gender) {
    return res
      .status(400)
      .json({message: 'First name, email, password, and gender are required'});
  }

  try {
    if (password.length < 8) {
      return res
        .status(400)
        .json({message: userMessages.validation.password.minlength});
    }

    if (!validator.isStrongPassword(password)) {
      return res
        .status(400)
        .json({message: userMessages.validation.password.weak});
    }

    const existingUser = await User.findOne({email});
    if (existingUser) {
      return res.status(400).json({message: 'User already exists'});
    }

    const hashedPassword = await hashPassword(password);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      gender,
    });
    await user.save();

    res.status(201).json({message: 'User created successfully'});
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const {email, password} = req.body;

  if (!email || !password) {
    return res.status(400).json({message: 'All fields are required'});
  }

  try {
    const user = await User.findOne({email}).select('+password'); // Explicitly include the password field in the query because it is set to select: false in the schema for security reasons.

    if (!user) {
      return res.status(401).json({message: 'Invalid credentials'});
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({message: 'Invalid credentials'});
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only in production
      sameSite: 'strict',
      maxAge: process.env.COOKIE_MAX_AGE,
    });

    res.status(200).json({message: 'Login successful', accessToken});
  } catch (error) {
    next(error);
  }
};

// Refresh Access Token
const refreshAccessToken = async (req, res) => {
  const {refreshToken} = req.cookies;

  if (!refreshToken) {
    return res.status(403).json({message: 'Refresh token not found'});
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const newAccessToken = generateAccessToken(decoded.id);
    const newRefreshToken = generateRefreshToken(decoded.id);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only in production
      sameSite: 'strict',
      maxAge: process.env.COOKIE_MAX_AGE,
    });
    res.status(200).json({accessToken: newAccessToken});
  } catch (error) {
    res.status(403).json({message: 'Invalid or expired refresh token'});
  }
};

const logout = (req, res) => {
  res.clearCookie('refreshToken');
  res.status(200).json({message: 'Logged out successfully'});
};

module.exports = {signUp, login, refreshAccessToken, logout};
