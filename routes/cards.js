const express = require('express');

const cardRouter = express.Router();

const { getCards, createCard, deleteCard, putLike, deleteLike } = require('../controllers/cards');

cardRouter.get('/', getCards);
cardRouter.post('/', createCard);
cardRouter.delete('/:cardId', deleteCard);
cardRouter.put('/:cardId/likes',  putLike);
cardRouter.delete('/:cardId/likes', deleteLike);

module.exports = cardRouter;