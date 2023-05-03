const express = require('express');

const userRouter = express.Router();

const {
  aboutValidation,
  avatarValidation,
  idValidation,
} = require('../utils/validate');

const {
  getUsers,
  getUserById,
  updateUserInfo,
  updateUserAvatar,
  getUser,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/me', getUser);
userRouter.get('/:userId', idValidation, getUserById);
userRouter.patch('/me', aboutValidation, updateUserInfo);
userRouter.patch('/me/avatar', avatarValidation, updateUserAvatar);

module.exports = userRouter;
