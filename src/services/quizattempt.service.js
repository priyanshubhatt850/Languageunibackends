const QuizAttempt = require("../models/QuizAttempt");

class QuizAttemptService {
  async list({ sort, limit, skip, fields }) {
    return QuizAttempt.find({})
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async filter(query, { sort, limit, skip, fields }) {
    return QuizAttempt.find(query)
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async getById(id) {
    return QuizAttempt.findById(id).lean();
  }

  async create(data) {
    return QuizAttempt.create(data);
  }

  async update(id, data) {
    return QuizAttempt.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    return QuizAttempt.findByIdAndDelete(id).lean();
  }

  async deleteMany(query) {
    return QuizAttempt.deleteMany(query);
  }
}

module.exports = new QuizAttemptService();
