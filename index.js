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

app.put('/talker/:id', validateToken, validateTalker, async (req, res, next) => {
  try {
    const data = await fs.readFile(dataBase, 'utf-8');
    const { name, age, talk } = req.body;
    const id = +req.params.id;
    const talkers = JSON.parse(data);
    const index = talkers.findIndex((person) => person.id === id);
    if (index) {
      const talkerEdit = { id, name, age, talk };
      talkers[index] = talkerEdit;
      await fs.writeFile(dataBase, JSON.stringify(talkers));
      return res.status(200).json(talkerEdit);
    }
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

app.delete('/talker/:id', validateToken, async (req, res, next) => {
  try {
    const data = await fs.readFile(dataBase, 'utf-8');
    const id = +req.params.id;
    const talkers = JSON.parse(data);
    const index = talkers.findIndex((person) => person.id === id);
    const indexWithOutId = talkers.filter((person) => person.id !== id);
    if (index) {
      await fs.writeFile(dataBase, JSON.stringify(indexWithOutId));
      res.status(204).end();
    }
  } catch (err) {
    next(err);
  }
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log('Online');
});
