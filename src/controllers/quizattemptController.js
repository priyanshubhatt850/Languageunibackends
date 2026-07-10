const BaseController = require('./BaseController');
const service = require('../services/quizattempt.service');

module.exports = new BaseController(service);
