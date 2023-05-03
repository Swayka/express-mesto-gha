const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const rootRouter = require('./routes/index');
const { loginValidation, userValidation } = require('./utils/validate');
const { login, createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.post('/signin', loginValidation, login);
app.post('/signup', userValidation, createUser);
app.use('/', rootRouter);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  if (err.code === 11000) {
    res.status(409).send({ message: 'Пользователь с таким email уже существует.' });
    return;
  }

  if (err.name === 'ForbiddenError') {
    res.status(err.statusCode).send({ message: err.message });
  }

  if (err.name === 'AuthenticationError') {
    res.status(err.statusCode).send({ message: err.message });
  }

  if (err.name === 'NotFoundError') {
    res.status(404).send({ message: err.message });
  }

  if (err.name === 'CastError') {
    res.status(400).send({ message: 'Некорректный id.' });
    return;
  }

  if (err.name === 'ValidationError') {
    res.status(400).send({ message: 'Переданы некорректные данные.' });
    return;
  }

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Некорректный путь или запрос.' });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
