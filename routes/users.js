const express = require('express');
const { aboutValidation, avatarValidation, idValidation } = require('../middlewares/validate');

const userRouter = express.Router();

const {
  getUsers, getUserById, updateUserInfo, updateUserAvatar, getUser,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/me', idValidation, getUser);
userRouter.get('/:userId', idValidation, getUserById);
userRouter.patch('/me', aboutValidation, updateUserInfo);
userRouter.patch('/me/avatar', avatarValidation, updateUserAvatar);

module.exports = userRouter;
