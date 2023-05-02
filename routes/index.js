const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');

router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);
router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
