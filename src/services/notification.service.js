const BaseService = require('./BaseService');
const Notification = require('../models/Notification');

class NotificationService extends BaseService {
  constructor() {
    super(Notification);
  }
}

module.exports = new NotificationService();
