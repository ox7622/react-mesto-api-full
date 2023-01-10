/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const path = require('path');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const { errorLogger, requestLogger } = require('./middlewares/logger');
const { cors } = require('./middlewares/cors');

const { errorHandler } = require('./middlewares/errorHandler');
const { validateLogin } = require('./middlewares/validateLogin');
const { login, createUser } = require('./controllers/users');

const { checkToken } = require('./middlewares/checkToken');
const routerCard = require('./routes/cards');
const routerUser = require('./routes/users');
const { validateCreateUser } = require('./middlewares/validateCreateUser');

mongoose.set('strictQuery', true);
// Слушаем 3000 порт
const { PORT = 3000, DB_LINK = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();
app.use(cors());

// подключаемся к серверу mongo
mongoose.connect(DB_LINK, {
  useNewUrlParser: true,
}, () => {
  console.log('Connected to Mongo db');
});

app.use(express.json());
app.use(requestLogger);

app.use(express.static(path.join(__dirname, '../frontend'))); // теперь клиент имеет доступ только к публичным файлам

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);

app.use('/users', checkToken, routerUser);
app.use('/cards', checkToken, routerCard);

app.use(errorLogger);
app.use(errors());
app.all('/*', (req, res) => res.status(404).json({ message: 'Страница не существует' }));
app.use(errorHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
