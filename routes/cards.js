const express = require('express');

const cardRouter = express.Router();

const { getCards, createCard, deleteCard, putLike, deleteLike } = require('../controllers/cards');

cardRouter.get('/cards', getCards);
cardRouter.post('/cards', createCard);
cardRouter.delete('/cards/:cardId', deleteCard);
cardRouter.put('/cards/:cardId/likes',  putLike);
cardRouter.delete('/cards/:cardId/likes', deleteLike);

module.exports = cardRouter;