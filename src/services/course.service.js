const BaseService = require('./BaseService');
const Course = require('../models/Course');

class CourseService extends BaseService {
  constructor() {
    super(Course);
  }
}

module.exports = new CourseService();
