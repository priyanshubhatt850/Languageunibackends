const BaseController = require('./BaseController');
const service = require('../services/instructorwallettransaction.service');

module.exports = new BaseController(service);
