const BaseService = require('./BaseService');
const Review = require('../models/Review');

class ReviewService extends BaseService {
  constructor() {
    super(Review);
  }
}

module.exports = new ReviewService();
