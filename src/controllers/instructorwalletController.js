const BaseController = require('./BaseController');
const service = require('../services/instructorwallet.service');

module.exports = new BaseController(service);
