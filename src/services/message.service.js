const BaseService = require('./BaseService');
const Message = require('../models/Message');

class MessageService extends BaseService {
  constructor() {
    super(Message);
  }
}

module.exports = new MessageService();
