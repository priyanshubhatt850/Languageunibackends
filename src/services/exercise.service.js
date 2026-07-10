const BaseService = require('./BaseService');
const Exercise = require('../models/Exercise');

class ExerciseService extends BaseService {
  constructor() {
    super(Exercise);
  }
}

module.exports = new ExerciseService();
