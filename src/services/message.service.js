const Message = require("../models/Message");

class MessageService {
  async list({ sort, limit, skip, fields }) {
    return Message.find({})
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async filter(query, { sort, limit, skip, fields }) {
    return Message.find(query)
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async getById(id) {
    return Message.findById(id).lean();
  }

  async create(data) {
    return Message.create(data);
  }

  async update(id, data) {
    return Message.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    return Message.findByIdAndDelete(id).lean();
  }

  async deleteMany(query) {
    return Message.deleteMany(query);
  }
}

module.exports = new MessageService();
