const BaseController = require('./BaseController');
const service = require('../services/review.service');

module.exports = new BaseController(service);
