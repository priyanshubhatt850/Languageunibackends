const BaseService = require('./BaseService');
const InstructorWallet = require('../models/InstructorWallet');

class InstructorWalletService extends BaseService {
  constructor() {
    super(InstructorWallet);
  }
}

module.exports = new InstructorWalletService();
