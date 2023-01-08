const { celebrate, Joi } = require('celebrate');
const routerCard = require('express').Router();

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

module.exports = routerCard;

routerCard.get('/', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
}), getCards);

routerCard.post('/', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required()
      .regex(/^https?:\/\/(wwww.)?[-._~:/?#@!$&'()*+,;=a-zA-Z0-9]+$/),
  }).unknown(true),
}), createCard);

routerCard.delete('/:id', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }).unknown(true),
}), deleteCard);

routerCard.put('/:id/likes', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }).unknown(true),
}), likeCard);

routerCard.delete('/:id/likes', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }).unknown(true),
}), dislikeCard);
