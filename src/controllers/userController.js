const BaseController = require('./BaseController');
const service = require('../services/user.service');

module.exports = new BaseController(service);
