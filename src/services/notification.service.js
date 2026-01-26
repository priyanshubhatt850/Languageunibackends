const Notification = require("../models/Notification");

class NotificationService {
  async list({ sort, limit, skip, fields }) {
    return Notification.find({})
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async filter(query, { sort, limit, skip, fields }) {
    return Notification.find(query)
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async getById(id) {
    return Notification.findById(id).lean();
  }

  async create(data) {
    return Notification.create(data);
  }

  async update(id, data) {
    return Notification.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    return Notification.findByIdAndDelete(id).lean();
  }

  async deleteMany(query) {
    return Notification.deleteMany(query);
  }
}

module.exports = new NotificationService();
