const Joi = require('joi');
const { ValidationError } = require('../utils/AppError');

const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const dataToValidate = source === 'params' ? req.params : source === 'query' ? req.query : req.body;
    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: source === 'query'
    });

    if (error) {
      const message = error.details.map(d => d.message).join(', ');
      return next(new ValidationError(message));
    }

    // Replace with validated (and stripped) data
    if (source === 'body') req.body = value;
    else if (source === 'params') req.params = value;
    else if (source === 'query') req.query = value;

    next();
  };
};

// Reusable ObjectId validator
const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Invalid ID format');

module.exports = { validate, objectId };
