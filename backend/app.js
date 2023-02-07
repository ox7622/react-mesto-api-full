/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { cors } = require('./middlewares/cors');

const { errorLogger, requestLogger } = require('./middlewares/logger');

const { errorHandler } = require('./middlewares/errorHandler');
const { validateLogin } = require('./middlewares/validateLogin');
const { login, createUser, logout } = require('./controllers/users');

const { checkToken } = require('./middlewares/checkToken');
const routerCard = require('./routes/cards');
const routerUser = require('./routes/users');
const { validateCreateUser } = require('./middlewares/validateCreateUser');
const { PORT, DB_LINK } = require('./constants/env');

mongoose.set('strictQuery', true);

const app = express();
app.use(express.json());

app.use(cors);
app.use(helmet());
app.use(cookieParser());

// подключаемся к серверу mongo
if (process.env.NODE_ENV !== 'production') {
  mongoose.connect(DB_LINK, {
    useNewUrlParser: true,
  }, () => {
    console.log('Connected to Mongo db');
  });
} else {
  mongoose.connect(process.env.DB_LINK, {
    useNewUrlParser: true,
  }, () => {
    console.log('Connected to Mongo db');
  });
}

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);
app.post('/logout', logout);

app.use('/users', checkToken, routerUser);
app.use('/cards', checkToken, routerCard);

app.use(errorLogger);
app.use(errors());
app.all('/*', (req, res) => res.status(404).json({ message: 'Страница не существует' }));
app.use(errorHandler);

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    // Если всё работает, консоль покажет, какой порт приложение слушает
    console.log(`App listening on port ${PORT}`);
  });
} else {
  app.listen(process.env.PORT, () => {
    // Если всё работает, консоль покажет, какой порт приложение слушает
    console.log(`App listening on port ${process.env.PORT}`);
  });
}
