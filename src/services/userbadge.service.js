const BaseService = require('./BaseService');
const UserBadge = require('../models/UserBadge');

class UserBadgeService extends BaseService {
  constructor() {
    super(UserBadge);
  }
}

module.exports = new UserBadgeService();
