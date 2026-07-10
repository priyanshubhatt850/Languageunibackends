const BaseService = require('./BaseService');
const InstructorRating = require('../models/InstructorRating');

class InstructorRatingService extends BaseService {
  constructor() {
    super(InstructorRating);
  }
}

module.exports = new InstructorRatingService();
