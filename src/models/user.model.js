const mongoose = require('mongoose');
const validator = require('validator');
const {user: userMessages} = require('../utils/messages');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, userMessages.validation.firstName.required],
      trim: true,
      minlength: [2, userMessages.validation.firstName.minlength],
      maxlength: [20, userMessages.validation.firstName.maxlength],
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: [20, userMessages.validation.lastName.maxlength],
    },
    email: {
      type: String,
      required: [true, userMessages.validation.email.required],
      unique: true,
      lowercase: true,
      trim: true,
      index: true, // good practice for clarity and query performance
      validate: {
        validator: validator.isEmail,
        message: userMessages.validation.email.invalid,
      },
    },
    password: {
      type: String,
      required: [true, userMessages.validation.password.required],
      select: false, // Do not return password in queries by default
    },
    age: {
      type: Number,
      min: [18, userMessages.validation.age.min],
      max: [150, userMessages.validation.age.max],
    },
    gender: {
      type: String,
      required: [true, userMessages.validation.gender.required],
      enum: {
        values: ['male', 'female', 'other'],
        message: userMessages.validation.gender.message,
      },
    },
    about: {
      type: String,
      trim: true,
      maxlength: [500, userMessages.validation.about.maxlength],
    },
    skills: {
      type: [String],
      validate: {
        validator: (value) => value.length <= 10,
        message: userMessages.validation.skills.message,
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    photoUrl: {
      type: String,
      default: process.env.DEFAULT_PHOTO_URL,
      validate: {
        validator: (value) => !value || validator.isURL(value),
        message: userMessages.validation.photoUrl.message,
      },
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('User', userSchema);
