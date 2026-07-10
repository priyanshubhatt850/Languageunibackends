const BaseService = require('./BaseService');
const Language = require('../models/Language');

class LanguageService extends BaseService {
  constructor() {
    super(Language);
  }
}

module.exports = new LanguageService();
