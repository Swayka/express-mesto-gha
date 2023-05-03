const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const auth = (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      throw new UnauthorizedError('Необходима авторизация');
    }
    const payload = jwt.verify(token, 'some-secret-key');

    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = auth;
