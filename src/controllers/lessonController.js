const BaseController = require('./BaseController');
const service = require('../services/lesson.service');

module.exports = new BaseController(service);
