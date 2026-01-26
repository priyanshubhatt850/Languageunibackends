const UserModel = require("../models/User");

class UserService {
  async list({ sort, limit, skip, fields }) {
    return UserModel.find({})
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async filter(query, { sort, limit, skip, fields }) {
    return UserModel.find(query)
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async getById(id) {
    return UserModel.findById(id).lean();
  }

  async create(data) {
    return UserModel.create(data);
  }

  async update(id, data) {
    return UserModel.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    return UserModel.findByIdAndDelete(id).lean();
  }

  async deleteMany(query) {
    return UserModel.deleteMany(query);
  }
}

module.exports = new UserService();
