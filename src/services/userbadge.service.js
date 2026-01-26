const UserBadge = require("../models/UserBadge");

class UserBadgeService {
  async list({ sort, limit, skip, fields }) {
    return UserBadge.find({})
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async filter(query, { sort, limit, skip, fields }) {
    return UserBadge.find(query)
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async getById(id) {
    return UserBadge.findById(id).lean();
  }

  async create(data) {
    return UserBadge.create(data);
  }

  async update(id, data) {
    return UserBadge.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    return UserBadge.findByIdAndDelete(id).lean();
  }

  async deleteMany(query) {
    return UserBadge.deleteMany(query);
  }
}

module.exports = new UserBadgeService();
