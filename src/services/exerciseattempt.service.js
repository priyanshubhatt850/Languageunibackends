const ExerciseAttempt = require("../models/ExerciseAttempt");

class ExerciseAttemptService {
  async list({ sort, limit, skip, fields }) {
    return ExerciseAttempt.find({})
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async filter(query, { sort, limit, skip, fields }) {
    return ExerciseAttempt.find(query)
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async getById(id) {
    return ExerciseAttempt.findById(id).lean();
  }

  async create(data) {
    return ExerciseAttempt.create(data);
  }

  async update(id, data) {
    return ExerciseAttempt.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    return ExerciseAttempt.findByIdAndDelete(id).lean();
  }

  async deleteMany(query) {
    return ExerciseAttempt.deleteMany(query);
  }
}

module.exports = new ExerciseAttemptService();
