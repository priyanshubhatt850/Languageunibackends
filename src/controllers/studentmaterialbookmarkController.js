const BaseController = require('./BaseController');
const service = require('../services/studentmaterialbookmark.service');

module.exports = new BaseController(service);
