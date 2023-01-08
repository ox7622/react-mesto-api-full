const Card = require('../models/card');

const {
  status200,
} = require('../constants/status');

const { decodeToken } = require('../utils/auth');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const AccessError = require('../errors/AccessError');

module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.status(status200).json(cards);
  } catch (err) {
    return next(err);
  }
};

module.exports.createCard = async (req, res, next) => {
  const ownerId = decodeToken(req.user);
  const { name, link } = req.body;
  try {
    const card = await Card.create({ name, link, owner: ownerId });
    return res.status(status200).json(card);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return next(new BadRequestError('Ошибка валидации данных карточки'));
    }
    return next(err);
  }
};

module.exports.deleteCard = async (req, res, next) => {
  const ownerId = decodeToken(req.user);
  const { id } = req.params;
  try {
    const card = await Card.findById(id);
    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }
    if (card.owner.toString() === ownerId._id.toString()) {
      await Card.findByIdAndRemove(id);
      return res.status(status200).json({ message: 'Карточка удалена' });
    }
    throw new AccessError('У вас нет права удалять эту карточку');
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return next(new BadRequestError('Ошибка валидации данных id карточки'));
    }
    return next(err);
  }
};

module.exports.likeCard = async (req, res, next) => {
  const ownerId = decodeToken(req.user);
  const { id } = req.params;
  try {
    const setLike = await Card.findByIdAndUpdate(
      id,
      { $addToSet: { likes: ownerId } }, // добавить _id в массив, если его там нет
      { new: true },
    );
    if (!setLike) {
      throw new NotFoundError('Такой карточки нет');
    }
    return res.status(status200).json({ message: 'Лайк поставлен' });
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return next(new BadRequestError('Ошибка валидации данных id карточки'));
    }
    return next(err);
  }
};

module.exports.dislikeCard = async (req, res, next) => {
  const ownerId = decodeToken(req.user);
  const { id } = req.params;
  try {
    const unlike = await Card.findByIdAndUpdate(
      id,
      { $pull: { likes: ownerId._id } },
      { new: true },
    );
    if (!unlike) {
      throw new NotFoundError('Такой карточки нет');
    }
    return res.status(status200).json({ message: 'Лайк снят' });
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return next(new BadRequestError('Ошибка валидации данных id карточки'));
    }
    return next(err);
  }
};
