const jwt = require('jsonwebtoken');

const LoginError = require('../errors/LoginError');
const Error500 = require('../errors/Error500');
const { status200 } = require('../constants/status');

module.exports.checkToken = (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    const authData = req.cookies.token;
    if (!authData || authData === undefined) {
      throw new LoginError('Пользователь не авторизован');
    }
    try {
      console.log(process.env.TOKEN, 'process.env.TOKEN');
      const verified = jwt.verify(authData, process.env.TOKEN);
      console.log(jwt.verify(authData, process.env.TOKEN), 'verify');
      req.user = verified._id;
      console.log(req.user, 'user', req, '- req');

      next();
    } catch (err) {
      return next(new LoginError('Пользователь не авторизован'));
    }
  }
  return next(new Error500('нет кук'));
};
