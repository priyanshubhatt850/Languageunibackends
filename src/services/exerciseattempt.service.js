const BaseService = require('./BaseService');
const ExerciseAttempt = require('../models/ExerciseAttempt');

class ExerciseAttemptService extends BaseService {
  constructor() {
    super(ExerciseAttempt);
  }
}

module.exports = new ExerciseAttemptService();
