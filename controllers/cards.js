const mongoose = require('mongoose');
const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные'));
      } else next(err);
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Доступ запрещен');
      }
      return Card.findOneAndDelete(req.params.cardId);
    })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы не корректные данные'));
      } else next(err);
    });
};

const updateCard = (req, res, updateData, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    updateData,
    { new: true },
  )
    .then((card) => {
      if (card) res.send({ data: card });
      else {
        throw new NotFoundError('Карточка не найдена');
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        throw new BadRequestError('Переданы не корректные данные');
      } else {
        next(err);
      }
    });
};

const putLike = (req, res, next) => {
  const updateData = { $addToSet: { likes: req.user._id } };
  updateCard(req, res, updateData, next);
};

const deleteLike = (req, res, next) => {
  const updateData = { $pull: { likes: req.user._id } };
  updateCard(req, res, updateData, next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
