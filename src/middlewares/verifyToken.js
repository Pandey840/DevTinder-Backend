const jwt = require('jsonwebtoken');
const {auth: authMessages} = require('../utils/messages');
const {tokenBlacklist} = require('../controllers/auth.controllers');

const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({message: authMessages.token.missing});
  }

  const token = authHeader.split(' ')[1];
  if (tokenBlacklist.has(token)) {
    return res.status(401).json({
      message: 'Your session has expired. Please log in again to continue.',
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({message: authMessages.token.invalid});
  }
};

module.exports = {verifyAccessToken};
