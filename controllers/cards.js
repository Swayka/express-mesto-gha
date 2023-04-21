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
      res.send(card);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(404).send({ message: 'Переданы некорректные данные при создании карточки' });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (card) {
        res.send(card);
      } else { res.status(404).send({ message: 'Карточка с указанным id не найдена' }); }
    })
    .catch((error) => {
      if (error.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Карточка с указанным id не найдена' });
        return;
      }
      if (error.name === 'CastError') {
        res.status(404).send({ message: 'Неверный формат id карточки' });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const putLike = (req, res) => {
    const { cardId } = req.params;
    Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
      .then((card) => {
        if (card) {
          res.send(card);
        } else { res.status(404).send({ message: 'Карточка не найдена' }); }
      })
      .catch((error) => {
        if (error.name === 'DocumentNotFoundError') {
          res.status(404).send({ message: 'Карточка не найдена' });
          return;
        }
        if (error.name === 'CastError') {
          res.status(404).send({ message: 'Неверный формат id карточки' });
          return;
        }
        res.status(500).send({ message: 'Произошла ошибка' });
      });
  };

  const deleteLike = (req, res) => {
    const { cardId } = req.params;
    Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
      .then((card) => {
        if (card) {
          res.send(card);
        } else { res.status(404).send({ message: 'Карточка не найдена' }); }
      })
      .catch((error) => {
        if (error.name === 'DocumentNotFoundError') {
          res.status(404).send({ message: 'Карточка не найдена' });
          return;
        }
        if (error.name === 'CastError') {
          res.status(404).send({ message: 'Неверный формат id карточки' });
          return;
        }
        res.status(500).send({ message: 'Произошла ошибка' });
      });
  };

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike
}