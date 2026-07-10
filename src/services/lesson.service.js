const BaseService = require('./BaseService');
const Lesson = require('../models/Lesson');

class LessonService extends BaseService {
  constructor() {
    super(Lesson);
  }
}

module.exports = new LessonService();
