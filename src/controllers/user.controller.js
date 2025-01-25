const createHttpError = require('http-errors');
const User = require('../models/user.model');
const validator = require('validator');
const {user: userMessages} = require('../utils/messages');
const {
  hashPassword,
  comparePassword,
} = require('../utils/bcrypt/passwordBcrypt');
const {formatDate} = require('../utils/parseTime/formatDate');

const updateUser = async (req, res, next) => {
  const userId = req.user.id; // Assuming user ID is available in req.user after authentication
  const updates = req.body;

  try {
    const user = await User.findById(userId).select(
      '-createdAt -updatedAt -__v',
    );
    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const allowedFields = ['age', 'about', 'skills', 'photoUrl'];
    Object.keys(updates).forEach((key) => {
      if (!allowedFields.includes(key)) {
        throw createHttpError(
          400,
          `Field "${key}" is not allowed to be updated`,
        );
      }
      user[key] = updates[key];
    });

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
  const userId = req.user.id;
  const {oldPassword, newPassword} = req.body;

  try {
    if (!oldPassword || !newPassword) {
      throw createHttpError(400, 'Both old and new passwords are required.');
    }

    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw createHttpError(404, 'User not found.');
    }

    const isMatch = await comparePassword(oldPassword, user.password);
    if (!isMatch) {
      throw createHttpError(401, 'Old password is incorrect.');
    }

    if (oldPassword === newPassword) {
      throw createHttpError(
        400,
        'New password cannot be the same as the old password.',
      );
    }

    if (newPassword.length < 8) {
      throw createHttpError(
        400,
        'New password must be at least 8 characters long.',
      );
    }

    if (!validator.isStrongPassword(newPassword)) {
      return res
        .status(400)
        .json({message: userMessages.validation.password.weak});
    }

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({message: 'Password updated successfully.'});
  } catch (error) {
    next(error);
  }
};

const userProfile = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).select('-__v');

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const formattedUser = {
      ...user.toObject(),
      createdAt: formatDate(user.createdAt),
      updatedAt: formatDate(user.updatedAt),
    };

    res.status(200).json(formattedUser);
  } catch (error) {
    next(error);
  }
};

module.exports = {updateUser, updatePassword, userProfile};
