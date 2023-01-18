const jwt = require('jsonwebtoken');

const LoginError = require('../errors/LoginError');

module.exports.checkToken = (req, res, next) => {
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
  } catch (err) {
    return next(new LoginError('Пользователь не авторизован'));
  }

};
