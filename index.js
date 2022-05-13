const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const errorMiddleware = require('./Middlewares/errorMiddleware');
const validateUser = require('./Middlewares/validateUser');

const dataBase = './talker.json';

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const BAD_REQUEST = 404;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', (_req, res, next) => {
  try {
    const data = fs.readFileSync(dataBase);
    return res.status(HTTP_OK_STATUS).json(JSON.parse(data));
  } catch (err) {
    next(err);
  }
});

app.get('/talker/:id', (req, res, next) => {
  try {
    const data = fs.readFileSync(dataBase);
    const id = +req.params.id;
    const talkers = JSON.parse(data);
    const talker = talkers.find((person) => person.id === id);
    if (talker) {
      return res.status(HTTP_OK_STATUS).json(talker);
    }
      return res.status(BAD_REQUEST).json({ message: 'Pessoa palestrante não encontrada' });
  } catch (err) {
    next(err);
  }
});

// consegui gerar um Token com ajuda do Stackoverflow:
// https://stackoverflow.com/questions/8855687/secure-random-token-in-node-js
app.post('/login', validateUser, (req, res, next) => {
  try {
    // crypto.randomBytes(8, (err, buffer) => {
    //   const token = buffer.toString('hex');
    const token = crypto.randomBytes(8).toString('hex');
    
      return res.status(200).json({ token });
    // });
  } catch (err) {
    next(err);
  }
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log('Online');
});
