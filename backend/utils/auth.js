/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

const LoginError = require('../errors/LoginError');
const TOKEN = require('../constants/env');

module.exports.createToken = (user) => {
  let token = '';
  if (process.env.NODE_ENV !== 'production') {
    token = jwt.sign({ _id: user._id }, TOKEN, { expiresIn: '7d' });
  } else {
    token = jwt.sign({ _id: user._id }, process.env.TOKEN, { expiresIn: '7d' });
  }
  return token;
};

module.exports.decodeToken = (token, next) => {
  if (!token) {
    throw new LoginError('Пользователь не авторизован');
  }
  try {
    return jwt.decode(token);
  } catch (err) {
    return next(err);
  }
};
