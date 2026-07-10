const BaseService = require('./BaseService');
const StudyMaterial = require('../models/StudyMaterial');

class StudyMaterialService extends BaseService {
  constructor() {
    super(StudyMaterial);
  }
}

module.exports = new StudyMaterialService();
