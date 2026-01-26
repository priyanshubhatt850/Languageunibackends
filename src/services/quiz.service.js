const Quiz = require("../models/Quiz");

class QuizService {
  async list({ sort, limit, skip, fields }) {
    return Quiz.find({})
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async filter(query, { sort, limit, skip, fields }) {
    return Quiz.find(query)
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async getById(id) {
    return Quiz.findById(id).lean();
  }

  async create(data) {
    return Quiz.create(data);
  }

  async update(id, data) {
    return Quiz.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    return Quiz.findByIdAndDelete(id).lean();
  }

  async deleteMany(query) {
    return Quiz.deleteMany(query);
  }
}

module.exports = new QuizService();
