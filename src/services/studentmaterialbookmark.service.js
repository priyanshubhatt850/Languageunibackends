const BaseService = require('./BaseService');
const StudentMaterialBookmark = require('../models/StudentMaterialBookmark');

class StudentMaterialBookmarkService extends BaseService {
  constructor() {
    super(StudentMaterialBookmark);
  }
}

module.exports = new StudentMaterialBookmarkService();
