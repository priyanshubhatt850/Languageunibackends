const BaseService = require('./BaseService');
const CourseLevel = require('../models/CourseLevel');

class CourseLevelService extends BaseService {
  constructor() {
    super(CourseLevel);
  }
}

module.exports = new CourseLevelService();
