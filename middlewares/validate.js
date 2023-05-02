const { celebrate, Joi, CelebrateError } = require('celebrate');
const validator = require('validator');

const validate = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new CelebrateError('Некорректный адрес');
};

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const userValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validate),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const idValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24).hex(),
  }),
});

const cardIdValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).hex(),
  }),
});

const cardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(validate),
  }),
});

const aboutValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

const avatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validate),
  }),
});

module.exports = {
  loginValidation,
  userValidation,
  idValidation,
  cardIdValidation,
  cardValidation,
  aboutValidation,
  avatarValidation,
};
