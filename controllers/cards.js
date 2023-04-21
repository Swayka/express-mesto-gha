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

//const putLike = (req, res) => {
//    const { cardId } = req.params;
//    Card.findByIdAndUpdate(
//      cardId,
//      { $addToSet: { likes: req.user._id } },
//      { new: true },
//    )
//      .orFail()
//      .then((like) => {
//        res.send(like);
//      })
//      .catch((error) => {
//        if (error.name === 'ValidationError') {
//          res.status(400).send({ message: 'Некорректные данные' });
//        } else if (error.name === 'DocumentNotFoundError') {
//          res.status(404).send({ message: 'Карточка не найдена' });
//        } else {
//          res.status(500).send({ message: 'Произошла ошибка' });
//        }
//      });
//  };
//
//  const deleteLike = (req, res) => {
//    const { cardId } = req.params;
//    Card.findByIdAndUpdate(
//      cardId,
//      { $pull: { likes: req.user._id } },
//      { new: true },
//    )
//      .orFail()
//      .then((card) => {
//        if (card) {
//          res.send({ data: card });
//        } else {
//          res.status(404).send({ message: 'Карточка не найдена'});
//        }
//      })
//      .catch((error) => {
//        if (error.name === 'CastError') {
//          res.status(400).send({ message: 'Некорректные данные' });
//        } else {
//          res.status(500).send({ message: 'Произошла ошибка' });
//        }
//      });
//  };
//
//const cardDataUpdate = (req, res, updateData) => {
//  Card.findByIdAndUpdate(req.params.cardId, updateData, { new: true })
//    .populate(['owner', 'likes'])
//    .then((card) => {
//      if (card) res.send({ data: card });
//      else res.status(404).send({ message: 'Карточка не найдена' });
//    })
//    .catch((err) => {
//      if (err instanceof mongoose.Error.CastError) {
//        res.status(400).send({ message: 'Переданы некорректные данные карточки.' });
//      } else {
//        res.status(500).send({ message: 'Произошла ошибка' });
//      }
//    });
//};

//const putLike = (req, res) => {
//  const updateData = { $addToSet: { likes: req.user._id } }; // добавить _id в массив
//  cardDataUpdate(req, res, updateData);
//};
//
//const deleteLike = (req, res) => {
//  const updateData = { $pull: { likes: req.user._id } }; // убрать _id из массива
//  cardDataUpdate(req, res, updateData);
//};

//const validateCard = (res, card) => {
//  if (!card) {
//    throw new NotFoundError('Пользователь по указанному _id не найден.');
//  }
//  return res.send(card);
//};

function putLike(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: { likes: req.user._id },
    },
    {
      new: true,
    },
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
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    },
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
//function deleteLike(req, res) {
//  const { cardId } = req.params;
//  Card.findByIdAndUpdate(
//    cardId,
//    {
//      $pull: { likes: req.user._id },
//    },
//    {
//      new: true,
//    },
//  )
//    .then((card) => {
//      if (card) {
//        res.status(200).send({ data: card });
//      } else {
//        res.status(404).send({ message: 'Передан невалидный id' });
//      }
//    })
//    .catch((error) => {
//      if (error.name === 'DocumentNotFoundError') {
//        res.status(404).send({ message: 'Карточка с указанным id не найдена'});
//        return;
//      }
//      if (error.name === 'CastError') {
//        res.status(400).send({ message: 'Неверный формат id карточки' });
//        return;
//      }
//        res.status(500).send({ message: 'Произошла ошибка' });
//
//    });
//}
module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike
}