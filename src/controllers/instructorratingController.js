const BaseController = require('./BaseController');
const service = require('../services/instructorrating.service');

module.exports = new BaseController(service);
