const express = require('express');
const fs = require('fs').promises;
const bodyParser = require('body-parser');
const crypto = require('crypto');
const errorMiddleware = require('./Middlewares/errorMiddleware');
const validateUser = require('./Middlewares/validateUser');
const { validateTalker, validateToken } = require('./Middlewares/validateTalker');

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

app.get('/talker', async (_req, res, next) => {
  try {
    const data = JSON.parse(await fs.readFile(dataBase));

    return res.status(HTTP_OK_STATUS).json(data);
  } catch (err) {
    next(err);
  }
});

app.get('/talker/:id', async (req, res, next) => {
  try {
    const data = JSON.parse(await fs.readFile(dataBase));
    const id = +req.params.id;
    const talker = data.find((person) => person.id === id);
    if (talker) {
      return res.status(HTTP_OK_STATUS).json(talker);
    }
      return res.status(BAD_REQUEST).json({ message: 'Pessoa palestrante não encontrada' });
  } catch (err) {
    next(err);
  }
});

app.post('/talker', validateToken, validateTalker, async (req, res) => {
  const data = JSON.parse(await fs.readFile(dataBase));
  const { name, age, talk: { watchedAt, rate } } = req.body;
    const newTalker = {
      name,
      age,
      id: data.length + 1,
       talk: {
          watchedAt,
          rate,
       },
    };
    data.push(newTalker);
    await fs.writeFile(dataBase, JSON.stringify(data));
    return res.status(201).json(newTalker);
});

// consegui gerar um Token com ajuda do Stackoverflow:
// https://stackoverflow.com/questions/8855687/secure-random-token-in-node-js
app.post('/login', validateUser, (req, res, next) => {
  try {
    const token = crypto.randomBytes(8).toString('hex');
    
      return res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log('Online');
});
