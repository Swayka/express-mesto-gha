const express = require('express');
const { cardValidation, cardIdValidation } = require('../middlewares/validate');

const cardRouter = express.Router();

const { getCards, createCard, deleteCard, putLike, deleteLike } = require('../controllers/cards');

cardRouter.get('/', getCards);
cardRouter.post('/', cardValidation, createCard);
cardRouter.delete('/:cardId', cardIdValidation, deleteCard);
cardRouter.put('/:cardId/likes',  cardIdValidation, putLike);
cardRouter.delete('/:cardId/likes', cardIdValidation, deleteLike);

module.exports = cardRouter;