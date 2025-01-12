const jwt = require('jsonwebtoken');
const {auth: authMessages} = require('../utils/messages');

const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({message: authMessages.token.missing});
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({message: authMessages.token.invalid});
  }
};

module.exports = {verifyAccessToken};
