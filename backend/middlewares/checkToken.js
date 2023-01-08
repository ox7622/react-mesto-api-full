/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

const { TOKEN = 'mytokendonkey' } = process.env;
const LoginError = require('../errors/LoginError');

module.exports.checkToken = (req, res, next) => {
  const authData = req.headers.authorization;
  if (!authData || !authData.startsWith('Bearer ') || authData === undefined) {
    throw new LoginError('Пользователь не авторизован');
  }
  const token = authData.replace('Bearer ', '');
  try {
    jwt.verify(token, TOKEN);
  } catch (err) {
    return next(new LoginError('Пользователь не авторизован'));
  }
  req.user = token;
  next();
};
