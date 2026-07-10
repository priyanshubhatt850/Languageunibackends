const BaseController = require('./BaseController');
const service = require('../services/message.service');

module.exports = new BaseController(service);
