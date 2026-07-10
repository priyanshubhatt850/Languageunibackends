const BaseController = require('./BaseController');
const service = require('../services/exercise.service');

module.exports = new BaseController(service);
