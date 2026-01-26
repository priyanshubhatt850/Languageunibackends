const Wallet = require("../models/Wallet");

class WalletService {
  async list({ sort, limit, skip, fields }) {
    return Wallet.find({})
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async filter(query, { sort, limit, skip, fields }) {
    return Wallet.find(query)
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async getById(id) {
    return Wallet.findById(id).lean();
  }

  async create(data) {
    return Wallet.create(data);
  }

  async update(id, data) {
    return Wallet.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    return Wallet.findByIdAndDelete(id).lean();
  }

  async deleteMany(query) {
    return Wallet.deleteMany(query);
  }
}

module.exports = new WalletService();
