const BaseController = require('./BaseController');
const service = require('../services/userbadge.service');

module.exports = new BaseController(service);
