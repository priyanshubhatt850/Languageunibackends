const Badge = require("../models/Badge");

class BadgeService {
  async list({ sort, limit, skip, fields }) {
    return Badge.find({})
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async filter(query, { sort, limit, skip, fields }) {
    return Badge.find(query)
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async getById(id) {
    return Badge.findById(id).lean();
  }

  async create(data) {
    return Badge.create(data);
  }

  async update(id, data) {
    return Badge.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    return Badge.findByIdAndDelete(id).lean();
  }

  async deleteMany(query) {
    return Badge.deleteMany(query);
  }
}

module.exports = new BadgeService();
