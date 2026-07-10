const BaseController = require('./BaseController');
const service = require('../services/exerciseattempt.service');

module.exports = new BaseController(service);
