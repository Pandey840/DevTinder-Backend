const express = require('express');
const {
  signUp,
  login,
  refreshAccessToken,
  logout,
} = require('../controllers/auth.controllers');

const authRouter = express.Router();

authRouter.post('/signup', signUp);
authRouter.post('/login', login);
authRouter.get('/refresh', refreshAccessToken);
authRouter.post('/logout', logout);

module.exports = authRouter;
