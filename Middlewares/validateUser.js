const Joi = require('joi');

const USER = Joi.object({

  // consegui customizar os erros do joi com ajuda do stackoverflow:
  // https://stackoverflow.com/questions/48720942/node-js-joi-how-to-display-a-custom-error-messages
  email: Joi.string().email().required()
    .messages({
      'string.empty': 'O campo "email" é obrigatório',
      'any.required': 'O campo "email" é obrigatório',
      'string.email': 'O "email" deve ter o formato "email@email.com"',
    }),
  password: Joi.string().min(6).required()
  .messages({
    'string.empty': 'O campo "password" é obrigatório',
    'any.required': 'O campo "password" é obrigatório',
    'string.min': 'O "password" deve ter pelo menos 6 caracteres',
  }),
});

const validateUser = (req, res, next) => {
  const { email, password } = req.body;

  const { error } = USER.validate({ email, password });

  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

module.exports = validateUser;