const BaseController = require('./BaseController');
const service = require('../services/language.service');

module.exports = new BaseController(service);
