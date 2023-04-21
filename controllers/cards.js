const Card = require('../models/card');
const { SUCCESS, COMPLETED, ERROR_BAD_DATA, ERROR_NOT_FOUND, ERROR_DEFAULT } = require('../utils/errors');

const getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch(() => {
      res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      card.populate('owner')
        .then((newCard) => res.status(COMPLETED).send(newCard))
        .catch(() => res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка' }));
    })
    //.then((card) => {
    //  res.status(COMPLETED).send({ data: card });
    //})
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(ERROR_BAD_DATA).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка' });
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  const owner = req.user._id;
  Card.findByIdAndRemove({owner, cardId})
    .orFail()
    .then((card) => {
      if (card) {
        res.send({ message: 'Карточка удалена'});
      } else {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' });
      }

    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        res.status(ERROR_BAD_DATA).send({ message: 'Некорректные данные' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка' });
      }
    });
};

const updateCard = (req, res, updateData) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    updateData,
    {new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card) {
        res.status(SUCCESS).send(card);
      } else { res.status(ERROR_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' }); }
    })
    .catch((error) => {
      //if (error.name === 'DocumentNotFoundError') {
      //  res.status(ERROR_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
      //  return;
      //}
      if (error instanceof mongoose.Error.CastError) {
        res.status(ERROR_BAD_DATA).send({ message: 'Неверный формат id карточки' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Ошибка на сервере' });
      }
    });
}

const putLike = (req, res) => {
  const updateData = { $addToSet: { likes: req.user._id } };
  updateCard(req, res, updateData);
};

const deleteLike = (req, res) => {
  const updateData = { $pull: { likes: req.user._id } };
  updateCard(req, res, updateData);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike
}