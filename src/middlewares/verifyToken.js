const jwt = require('jsonwebtoken');
const Token = require('../models/tokens.model');
const {auth: authMessages} = require('../utils/messages');
const {decryptToken} = require('../utils/jwtTokens/encryptTokens');

const verifyAccessToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({message: authMessages.token.missing});
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const tokenRecord = await Token.findOne({
      userId: decoded.id,
      type: 'access',
    });

    if (!tokenRecord || tokenRecord.expiresAt < Date.now()) {
      return res.status(401).json({message: 'Token is invalid or expired'});
    }

    const decryptedToken = decryptToken(tokenRecord.token, tokenRecord.iv);

    if (decryptedToken !== token) {
      return res.status(401).json({message: 'Token is invalid or expired'});
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({message: authMessages.token.invalid});
  }
};

module.exports = {verifyAccessToken};
