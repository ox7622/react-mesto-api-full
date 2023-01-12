const bcrypt = require('bcrypt');
const User = require('../models/user');
const {
  status200,
} = require('../constants/status');
const { createToken, decodeToken } = require('../utils/auth');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const AccountExistsError = require('../errors/AccountExistsError');
const LoginError = require('../errors/LoginError');

module.exports.createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    await User.init();
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, about, avatar, email, password: hash,
    });
    return res.status(status200).json({
      name: user.name, about: user.about, avatar: user.avatar, email: user.email,
    });
  } catch (err) {
    if (err.code === 11000) {
      return next(new AccountExistsError('Пользователь с такими данными уже есть в базе'));
    }
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return next(new BadRequestError('Ошибка валидации данных пользователя'));
    }
    return next(err);
  }
};

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.status(status200).json(users);
  } catch (err) {
    return next(err);
  }
};

module.exports.findUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    return res.status(status200).json(user);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return next(new BadRequestError('Ошибка валидации данных пользователя'));
    }
    return next(err);
  }
};

module.exports.updateUser = async (req, res, next) => {
  const userId = decodeToken(req.user);
  if (!User.findById(userId._id)) {
    throw new NotFoundError('Пользователь не найден');
  }
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      userId._id,
      { name, about },
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      },
    );
    return res.status(status200).json(user);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return next(new BadRequestError('Ошибка валидации данных пользователя'));
    }
    return next(err);
  }
};

module.exports.updateAvatar = async (req, res, next) => {
  const userId = decodeToken(req.user);
  const { avatar } = req.body;
  try {
    if (!User.findById(userId._id)) {
      throw new NotFoundError('Пользователь не найден');
    }
    const user = await User.findByIdAndUpdate(
      userId._id,
      { avatar },
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      },
    );

    return res.status(status200).json(user);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return next(new BadRequestError('Ошибка валидации данных ссылки на аватар пользователя'));
    }
    return next(err);
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new LoginError('Неправильный логин или пароль');
    }
    const result = await bcrypt.compare(password, user.password);
    if (result) {
      const token = createToken(user);
      return res.cookie('token', token, {
        httpOnly: true,
      }).status(status200).json({ message: 'Вы успешно вошли' });
    }
    throw new LoginError('Неправильный логин или пароль');
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return next(new BadRequestError('Ошибка валидации данных ссылки на аватар пользователя'));
    }
    return next(err);
  }
};

module.exports.getProfile = async (req, res, next) => {
  const userId = decodeToken(req.user);
  try {
    const user = await User.findById(userId._id);
    if (!user) {
      throw new NotFoundError('Такого пользователя в базе нет');
    }
    return res.status(status200).json(user);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return next(new BadRequestError('Ошибка валидации данных ссылки на аватар пользователя'));
    }
    return next(err);
  }
};
