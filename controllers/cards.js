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
      res.send({ data: card });
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

function putLike(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {$addToSet: { likes: req.user._id }},
    {new: true},
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
        return;
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Передан невалидный id' });
        return;
      }
        res.status(500).send({ message: 'Произошла ошибка' });

    });
}

function deleteLike(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {$pull: { likes: req.user._id }},
    {new: true },
  )
    .then((card) => {
      if (card) {
        res.status(200).send(card);
      } else { res.status(404).send({ message: 'Карточка с указанным id не найдена' }); }
    })
    .catch((error) => {
      if (error.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Карточка с указанным id не найдена' });
        return;
      }
      if (error.name === 'CastError') {
        res.status(400).send({ message: 'Неверный формат id карточки' });
        return;
      }
      res.status(500).send({ message: 'Ошибка на сервере' });
    });
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike
}