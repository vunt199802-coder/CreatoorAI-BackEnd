const Joi = require('joi');

const generateMusic = {
  body: Joi.object().keys({
    prompt: Joi.string().required(),
  }),
};

const getGenerationResult = {
  params: Joi.object().keys({
    taskId: Joi.string().required(),
  }),
};

module.exports = {
  generateMusic,
  getGenerationResult,
};
