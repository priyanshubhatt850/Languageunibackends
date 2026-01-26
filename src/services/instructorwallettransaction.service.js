const InstructorWalletTransaction = require("../models/InstructorWalletTransaction");

class InstructorWalletTransactionService {
  async list({ sort, limit, skip, fields }) {
    return InstructorWalletTransaction.find({})
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async filter(query, { sort, limit, skip, fields }) {
    return InstructorWalletTransaction.find(query)
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async getById(id) {
    return InstructorWalletTransaction.findById(id).lean();
  }

  async create(data) {
    return InstructorWalletTransaction.create(data);
  }

  async update(id, data) {
    return InstructorWalletTransaction.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    return InstructorWalletTransaction.findByIdAndDelete(id).lean();
  }

  async deleteMany(query) {
    return InstructorWalletTransaction.deleteMany(query);
  }
}

module.exports = new InstructorWalletTransactionService();
