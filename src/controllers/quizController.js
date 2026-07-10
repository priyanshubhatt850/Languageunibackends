const BaseController = require('./BaseController');
const service = require('../services/quiz.service');

module.exports = new BaseController(service);
