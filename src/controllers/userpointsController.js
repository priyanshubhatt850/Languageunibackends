const BaseController = require('./BaseController');
const service = require('../services/userpoints.service');

module.exports = new BaseController(service);
