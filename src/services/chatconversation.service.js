const ChatConversation = require("../models/ChatConversation");

class ChatConversationService {
  async list({ sort, limit, skip, fields }) {
    return ChatConversation.find({})
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async filter(query, { sort, limit, skip, fields }) {
    return ChatConversation.find(query)
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async getById(id) {
    return ChatConversation.findById(id).lean();
  }

  async create(data) {
    return ChatConversation.create(data);
  }

  async update(id, data) {
    return ChatConversation.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    return ChatConversation.findByIdAndDelete(id).lean();
  }

  async deleteMany(query) {
    return ChatConversation.deleteMany(query);
  }
}

module.exports = new ChatConversationService();
