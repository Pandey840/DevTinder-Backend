const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  token: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['access', 'refresh'],
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: {expires: 0}, // TTL index
  },
  iv: {
    type: String,
    required: true,
  },
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
