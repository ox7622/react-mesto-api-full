/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const path = require('path');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const { errorLogger, requestLogger } = require('./middlewares/logger');

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

// подключаемся к серверу mongo
mongoose.connect(DB_LINK, {
  useNewUrlParser: true,
}, () => {
  console.log('Connected to Mongo db');
});

app.use(express.json());
app.use(requestLogger);

app.use(express.static(path.join(__dirname, '/frontend'))); // теперь клиент имеет доступ только к публичным файлам

// Массив доменов, с которых разрешены кросс-доменные запросы
const allowedCors = [
  'https://ox7622.nomoredomains.club',
  'http://ox7622.nomoredomains.club',
  'localhost:3000',
];

app.use((req, res, next) => {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  // проверяем, что источник запроса есть среди разрешённых
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную

  // Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];
  // Если это предварительный запрос, добавляем нужные заголовки
  if (method === 'OPTIONS') {
    // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    // разрешаем кросс-доменные запросы с этими заголовками
    res.header('Access-Control-Allow-Headers', requestHeaders);
    // завершаем обработку запроса и возвращаем результат клиенту
    return res.end();
  }

  next();
});

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
