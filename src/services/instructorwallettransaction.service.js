const BaseService = require('./BaseService');
const InstructorWalletTransaction = require('../models/InstructorWalletTransaction');

class InstructorWalletTransactionService extends BaseService {
  constructor() {
    super(InstructorWalletTransaction);
  }
}

module.exports = new InstructorWalletTransactionService();
