const Joi = require('joi');

const register = Joi.object({
  email: Joi.string().email().required().trim().lowercase(),
  password: Joi.string().min(6).required(),
  full_name: Joi.string().trim(),
  role: Joi.string().valid('student', 'instructor', 'candidate'),
  phone: Joi.string(),
  phoneNo: Joi.string()
});

const login = Joi.object({
  email: Joi.string().email().required().trim().lowercase(),
  password: Joi.string().required()
});

const updateMe = Joi.object({
  full_name: Joi.string().trim(),
  firstName: Joi.string().trim(),
  lastName: Joi.string().trim(),
  phone: Joi.string(),
  phoneNo: Joi.string(),
  countryCode: Joi.string(),
  avatar_url: Joi.string().uri().allow(''),
  profileImgs: Joi.array().items(Joi.string()),
  address: Joi.string(),
  city: Joi.string(),
  state: Joi.string(),
  country: Joi.string(),
  learning_languages: Joi.array().items(Joi.string()),
  learning_interests: Joi.array().items(Joi.string()),
  onboarding_completed: Joi.boolean()
});

module.exports = { register, login, updateMe };
