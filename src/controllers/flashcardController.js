const BaseController = require('./BaseController');
const service = require('../services/flashcard.service');

module.exports = new BaseController(service);
