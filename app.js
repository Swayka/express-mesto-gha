const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '6442280780e747f5950e1457'
  };

  next();
});
app.use(userRouter);
app.use(cardRouter);

app.use('*', (req, res) => {
  res.status(404).send({message: 'Что-то пошло не так'});
});

app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});

