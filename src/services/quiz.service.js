const BaseService = require('./BaseService');
const Quiz = require('../models/Quiz');

class QuizService extends BaseService {
  constructor() {
    super(Quiz);
  }
}

module.exports = new QuizService();
