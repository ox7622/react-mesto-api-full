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
      console.log(verified, '-dev');
    }
    verified = jwt.verify(authData, process.env.TOKEN);
    console.log(verified, '-prod');
    console.log(authData, '-authdata');
    if (verified) {
      req.user = authData;
      console.log(authData, '-authdata in verified');
      console.log(req.user, '-req.user');
      next();
    }
  } catch (err) {
    return next(new LoginError('Пользователь не авторизован'));
  }
};
