const Token = require('../models/tokens.model');
const {encryptToken} = require('../utils/jwtTokens/encryptTokens');

const saveToken = async (userId, token, type, expiresIn) => {
  const {encryptedToken, iv} = encryptToken(token);
  const expiresAt = new Date(Date.now() + expiresIn * 1000); // expiresIn is in seconds, so convert to milliseconds
  const newToken = new Token({
    userId,
    token: encryptedToken,
    type,
    expiresAt,
    iv,
  });

  await newToken.save();
};

const removeToken = async (userId, types) => {
  await Token.deleteMany({
    userId,
    type: {$in: types},
  });
};

module.exports = {saveToken, removeToken};
