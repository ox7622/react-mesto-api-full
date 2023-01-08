/* eslint-disable no-unused-vars */
const { celebrate, Joi } = require('celebrate');

module.exports.validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string()
      .regex(/^https?:\/\/(wwww.)?[-._~:/?#@!$&'()*+,;=a-zA-Z0-9]+$/),
    email: Joi.string().required().regex(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/),
    password: Joi.string().required(),
  }),
});
