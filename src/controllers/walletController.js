const BaseController = require('./BaseController');
const service = require('../services/wallet.service');

module.exports = new BaseController(service);
