const Joi = require('joi')
 .extend(require('@joi/date'));

const TALKER = Joi.object({
  name: Joi.string().min(3).required()
  .messages({
    'string.empty': 'O campo "name" é obrigatório',
    'any.required': 'O campo "name" é obrigatório',
    'string.min': 'O "name" deve ter pelo menos 3 caracteres',
  }),
  age: Joi.number().min(18).required()
  .messages({
    'number.empty': 'O campo "age" é obrigatório',
    'any.required': 'O campo "age" é obrigatório',
    'number.min': 'A pessoa palestrante deve ser maior de idade',
  }),
  talk: Joi.object().keys({
    rate: Joi.number().min(1).max(5).required()
      .messages({
        'number.min': 'O campo "rate" deve ser um inteiro de 1 à 5',
        'number.max': 'O campo "rate" deve ser um inteiro de 1 à 5',
        'any.required': 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios',
      }),
    watchedAt: Joi.date().format('DD/MM/YYYY').required()
      .messages({
        'date.format': 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
        'any.required': 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios',
      }),
  }).required().messages({
    'any.required': 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios',
  }),
});

const validateTalker = (req, res, next) => {
  const { name, age, talk } = req.body;
  const { error } = TALKER.validate({ name, age, talk });

  if (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
  
  next();
};

const validateToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
      return res.status(401).json({
          message: 'Token não encontrado',
      });
  }
  if (authorization.length !== 16) {
      return res.status(401).json({
          message: 'Token inválido',
      });
  }
  next();
};

module.exports = {
  validateTalker,
  validateToken,
};
