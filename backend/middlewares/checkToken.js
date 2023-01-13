/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

const LoginError = require('../errors/LoginError');

module.exports.checkToken = (req, res, next) => {
  const authData = req.cookies.token;
  if (!authData || authData === undefined) {
    throw new LoginError('Пользователь не авторизован');
  }
  try {
    jwt.verify(authData, process.env.TOKEN);
  } catch (err) {
    return next(new LoginError('Пользователь не авторизован'));
  }
  req.user = authData;
  next();
};
