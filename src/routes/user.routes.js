const express = require('express');
const {updateUser, updatePassword} = require('../controllers/user.controller');
const {verifyAccessToken} = require('../middlewares/verifyToken');

const userRouter = express.Router();

userRouter.use(verifyAccessToken);
userRouter.put('/update', updateUser);
userRouter.patch('/password', updatePassword);

module.exports = userRouter;
