const Joi = require('joi');
const { objectId } = require('../middleware/validate');

const addToCart = Joi.object({
  courseId: objectId.required()
});

const removeFromCart = Joi.object({
  courseId: objectId.required()
});

const sendReminder = Joi.object({
  userId: objectId.required(),
  courseNames: Joi.array().items(Joi.string()).min(1).required()
});

module.exports = { addToCart, removeFromCart, sendReminder };
