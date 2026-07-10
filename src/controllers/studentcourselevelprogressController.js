const BaseController = require('./BaseController');
const service = require('../services/studentcourselevelprogress.service');

module.exports = new BaseController(service);
