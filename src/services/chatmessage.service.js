const ChatMessage = require("../models/ChatMessage");

class ChatMessageService {
  async list({ sort, limit, skip, fields }) {
    return ChatMessage.find({})
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async filter(query, { sort, limit, skip, fields }) {
    return ChatMessage.find(query)
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async getById(id) {
    return ChatMessage.findById(id).lean();
  }

  async create(data) {
    return ChatMessage.create(data);
  }

  async update(id, data) {
    return ChatMessage.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    return ChatMessage.findByIdAndDelete(id).lean();
  }

  async deleteMany(query) {
    return ChatMessage.deleteMany(query);
  }
}

module.exports = new ChatMessageService();
