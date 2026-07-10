const BaseService = require('./BaseService');
const ChatMessage = require('../models/ChatMessage');

class ChatMessageService extends BaseService {
  constructor() {
    super(ChatMessage);
  }
}

module.exports = new ChatMessageService();
