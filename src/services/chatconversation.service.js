const BaseService = require('./BaseService');
const ChatConversation = require('../models/ChatConversation');

class ChatConversationService extends BaseService {
  constructor() {
    super(ChatConversation);
  }
}

module.exports = new ChatConversationService();
