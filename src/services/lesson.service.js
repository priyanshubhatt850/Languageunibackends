const Lesson = require("../models/Lesson");

class LessonService {
  async list({ sort, limit, skip, fields }) {
    return Lesson.find({})
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async filter(query, { sort, limit, skip, fields }) {
    return Lesson.find(query)
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async getById(id) {
    return Lesson.findById(id).lean();
  }

  async create(data) {
    return Lesson.create(data);
  }

  async update(id, data) {
    return Lesson.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    return Lesson.findByIdAndDelete(id).lean();
  }

  async deleteMany(query) {
    return Lesson.deleteMany(query);
  }
}

module.exports = new LessonService();
