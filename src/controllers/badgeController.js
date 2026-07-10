const BaseController = require('./BaseController');
const service = require('../services/badge.service');

module.exports = new BaseController(service);
