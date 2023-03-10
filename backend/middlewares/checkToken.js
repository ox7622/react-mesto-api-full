/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

const LoginError = require('../errors/LoginError');

const TOKEN = require('../constants/env');

module.exports.checkToken = (req, res, next) => {
  const authData = req.cookies.token;
  if (!authData || authData === undefined) {
    throw new LoginError('Пользователь не авторизован');
  }
  try {
    let verified;
    if (process.env.NODE_ENV !== 'production') {
      verified = jwt.verify(authData, TOKEN);
    } else {
      verified = jwt.verify(authData, process.env.TOKEN);
    }

    if (verified) {
      req.user = authData;
      next();
    }
  } catch (err) {
    return next(new LoginError('Пользователь не авторизован'));
  }
};
