const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const auth = require('../middlewares/auth');
const { loginValidation, userValidation } = require('../middlewares/validate');
const { login, createUser } = require('../controllers/users');

router.post('/signin', loginValidation, login);
router.post('/signup', userValidation, createUser);

router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);

module.exports = router;
