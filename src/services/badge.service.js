const BaseService = require('./BaseService');
const Badge = require('../models/Badge');

class BadgeService extends BaseService {
  constructor() {
    super(Badge);
  }
}

module.exports = new BadgeService();
