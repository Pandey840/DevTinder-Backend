const express = require('express');
const {
  signUp,
  login,
  refreshAccessToken,
  logout,
} = require('../controllers/auth.controllers');
const {verifyAccessToken} = require('../middlewares/verifyToken');

const authRouter = express.Router();

authRouter.post('/signup', signUp);
authRouter.post('/login', login);
authRouter.get('/refresh', refreshAccessToken);
authRouter.post('/logout', verifyAccessToken, logout);

module.exports = authRouter;
