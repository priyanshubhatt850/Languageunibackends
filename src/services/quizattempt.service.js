const BaseService = require('./BaseService');
const QuizAttempt = require('../models/QuizAttempt');

class QuizAttemptService extends BaseService {
  constructor() {
    super(QuizAttempt);
  }
}

module.exports = new QuizAttemptService();
