const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rootRouter = require('./routes/index');
const { login, createUser } = require('./controllers/users');
const { loginValidation, userValidation } = require('./middlewares/validate');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.post('/signin', loginValidation, login);
app.post('/signup', userValidation, createUser);
app.use('/', rootRouter);

app.use((err, req, res) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
