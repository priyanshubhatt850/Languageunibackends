const BaseController = require('./BaseController');
const service = require('../services/courselevel.service');

module.exports = new BaseController(service);
