const BaseController = require('./BaseController');
const service = require('../services/studymaterial.service');

module.exports = new BaseController(service);
