const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .orFail()
    .then((card) => {
      res.send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(400).send({ message: 'Некорректные данные' });
      } else if (error.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

const putLike = (req, res) => {
    const { cardId } = req.params;
    Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
      .orFail()
      .then((like) => {
        res.send(like);
      })
      .catch((error) => {
        if (error.name === 'CastError') {
          res.status(400).send({ message: 'Некорректные данные' });
        } else if (error.name === 'DocumentNotFoundError') {
          res.status(404).send({ message: 'Карточка не найдена' });
        } else {
          res.status(500).send({ message: 'Произошла ошибка' });
        }
      });
  };

  const deleteLike = (req, res) => {
    const { cardId } = req.params;
    Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
      .orFail()
      .then((like) => {
        res.send(like);
      })
      .catch((error) => {
        if (error.name === 'CastError') {
          res.status(400).send({ message: 'Некорректные данные' });
        } else if (error.name === 'DocumentNotFoundError') {
          res.status(404).send({ message: 'Карточка не найдена' });
        } else {
          res.status(500).send({ message: 'Произошла ошибка' });
        }
      });
  };

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike
}