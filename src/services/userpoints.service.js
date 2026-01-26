const UserPoints = require("../models/UserPoints");

class UserPointsService {
  async list({ sort, limit, skip, fields }) {
    return UserPoints.find({})
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async filter(query, { sort, limit, skip, fields }) {
    return UserPoints.find(query)
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async getById(id) {
    return UserPoints.findById(id).lean();
  }

  async create(data) {
    return UserPoints.create(data);
  }

  async update(id, data) {
    return UserPoints.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    return UserPoints.findByIdAndDelete(id).lean();
  }

  async deleteMany(query) {
    return UserPoints.deleteMany(query);
  }
}

module.exports = new UserPointsService();
