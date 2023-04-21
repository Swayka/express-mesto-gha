const express = require('express');

const userRouter = express.Router();

const { getUsers, createUser, getUserById, updateUserInfo, updateUserAvatar } = require('../controllers/users');

userRouter.get('/users', getUsers);
userRouter.get('/users/:userId', getUserById);
userRouter.post('/users', createUser);
userRouter.patch('/users/me', updateUserInfo);
userRouter.patch('/users/me/avatar', updateUserAvatar);

module.exports = userRouter;
