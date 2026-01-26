const TeachingSession = require("../models/TeachingSession");

class TeachingSessionService {
  async list({ sort, limit, skip, fields }) {
    return TeachingSession.find({})
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async filter(query, { sort, limit, skip, fields }) {
    return TeachingSession.find(query)
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async getById(id) {
    return TeachingSession.findById(id).lean();
  }

  async create(data) {
    return TeachingSession.create(data);
  }

  async update(id, data) {
    return TeachingSession.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    return TeachingSession.findByIdAndDelete(id).lean();
  }

  async deleteMany(query) {
    return TeachingSession.deleteMany(query);
  }
}

module.exports = new TeachingSessionService();
