const BaseController = require('./BaseController');
const service = require('../services/notification.service');

module.exports = new BaseController(service);
