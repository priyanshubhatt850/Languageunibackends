const InstructorWallet = require("../models/InstructorWallet");

class InstructorWalletService {
  async list({ sort, limit, skip, fields }) {
    return InstructorWallet.find({})
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async filter(query, { sort, limit, skip, fields }) {
    return InstructorWallet.find(query)
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async getById(id) {
    return InstructorWallet.findById(id).lean();
  }

  async create(data) {
    return InstructorWallet.create(data);
  }

  async update(id, data) {
    return InstructorWallet.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    return InstructorWallet.findByIdAndDelete(id).lean();
  }

  async deleteMany(query) {
    return InstructorWallet.deleteMany(query);
  }
}

module.exports = new InstructorWalletService();
