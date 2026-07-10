const BaseController = require('./BaseController');
const service = require('../services/course.service');

module.exports = new BaseController(service);
