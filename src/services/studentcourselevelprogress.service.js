const BaseService = require('./BaseService');
const StudentCourseLevelProgress = require('../models/StudentCourseLevelProgress');

class StudentCourseLevelProgressService extends BaseService {
  constructor() {
    super(StudentCourseLevelProgress);
  }
}

module.exports = new StudentCourseLevelProgressService();
