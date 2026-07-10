const BaseService = require('./BaseService');
const UserPoints = require('../models/UserPoints');

class UserPointsService extends BaseService {
  constructor() {
    super(UserPoints);
  }
}

module.exports = new UserPointsService();
