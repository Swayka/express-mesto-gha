const router = require('express').Router();
const cardsRouter = require('./cards');
const usersRouter = require('./users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');

router.use('/cards', auth, cardsRouter);
router.use('/users', auth, usersRouter);
router.use('/*', auth, () => {
  throw new NotFoundError('Страница не найдена');
});

module.exports = router;
