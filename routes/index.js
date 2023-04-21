const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const { ERROR_NOT_FOUND } = require('../utils/errors');

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.all('*', (req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Страница не найдена' });
});

module.exports = router;