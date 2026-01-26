const Course = require("../models/Course");

class CourseService {
  async list({ sort, limit, skip, fields }) {
    return Course.find({})
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async filter(query, { sort, limit, skip, fields }) {
    return Course.find(query)
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async getById(id) {
    return Course.findById(id).lean();
  }

  async create(data) {
    return Course.create(data);
  }

  async update(id, data) {
    return Course.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    return Course.findByIdAndDelete(id).lean();
  }

  async deleteMany(query) {
    return Course.deleteMany(query);
  }
}

module.exports = new CourseService();
