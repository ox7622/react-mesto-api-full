/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

const { TOKEN = 'mytokendonkey' } = process.env;
const LoginError = require('../errors/LoginError');

module.exports.createToken = (user) => {
  const token = jwt.sign({ _id: user._id }, TOKEN, { expiresIn: '7d' });
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
