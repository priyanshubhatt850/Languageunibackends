const Exercise = require("../models/Exercise");

class ExerciseService {
  async list({ sort, limit, skip, fields }) {
    return Exercise.find({})
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async filter(query, { sort, limit, skip, fields }) {
    return Exercise.find(query)
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async getById(id) {
    return Exercise.findById(id).lean();
  }

  async create(data) {
    return Exercise.create(data);
  }

  async update(id, data) {
    return Exercise.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    return Exercise.findByIdAndDelete(id).lean();
  }

  async deleteMany(query) {
    return Exercise.deleteMany(query);
  }
}

module.exports = new ExerciseService();
