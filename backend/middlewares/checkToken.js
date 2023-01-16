const jwt = require('jsonwebtoken');

const LoginError = require('../errors/LoginError');
const Error500 = require('../errors/Error500');

module.exports.checkToken = (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    const authData = req.cookies.token;
    if (!authData || authData === undefined) {
      throw new LoginError('Пользователь не авторизован');
    }
    try {
      const verified = jwt.verify(authData, process.env.TOKEN);
      if (verified) {
        req.user = authData;
        next();
      }
      console.log(verified, 'verified');
    } catch (err) {
      return next(new LoginError('Пользователь не авторизован'));
    }
  }
  return next(new Error500('нет кук'));
};
