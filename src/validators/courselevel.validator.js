const Joi = require('joi');
const { objectId } = require('../middleware/validate');

const create = Joi.object({
  language_id: objectId.required(),
  level_name: Joi.string().required().trim(),
  level_type: Joi.string().valid('standard', 'exam'),
  description: Joi.string(),
  learning_goals: Joi.array().items(Joi.string()),
  price: Joi.number().min(0).required(),
  discount_price: Joi.number().min(0),
  duration_hours: Joi.number().min(0),
  instructor_id: objectId,
  instructor_hourly_rate: Joi.number().min(0),
  thumbnail_url: Joi.string().uri().allow(''),
  status: Joi.string().valid('draft', 'published', 'archived'),
  display_order: Joi.number().min(0)
});

module.exports = { create };
