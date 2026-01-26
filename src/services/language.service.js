const Language = require("../models/Language");

class LanguageService {
  async list({ sort, limit, skip, fields }) {
    return Language.find({})
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async filter(query, { sort, limit, skip, fields }) {
    return Language.find(query)
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async getById(id) {
    return Language.findById(id).lean();
  }

  async create(data) {
    return Language.create(data);
  }

  async update(id, data) {
    return Language.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    return Language.findByIdAndDelete(id).lean();
  }

  async deleteMany(query) {
    return Language.deleteMany(query);
  }
}

module.exports = new LanguageService();
