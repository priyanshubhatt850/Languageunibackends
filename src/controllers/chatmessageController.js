const BaseController = require('./BaseController');
const service = require('../services/chatmessage.service');

module.exports = new BaseController(service);
