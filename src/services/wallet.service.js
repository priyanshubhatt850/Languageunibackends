const BaseService = require('./BaseService');
const Wallet = require('../models/Wallet');

class WalletService extends BaseService {
  constructor() {
    super(Wallet);
  }
}

module.exports = new WalletService();
