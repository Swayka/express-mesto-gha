const httpConstants = require('http2').constants;

const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  const { message } = err;

  res.status(status).send({
    err,
    message,
  });
  next();
};

module.exports = errorHandler;
