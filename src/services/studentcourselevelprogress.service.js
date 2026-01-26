const StudentCourseLevelProgress = require("../models/StudentCourseLevelProgress");

class StudentCourseLevelProgressService {
  async list({ sort, limit, skip, fields }) {
    return StudentCourseLevelProgress.find({})
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async filter(query, { sort, limit, skip, fields }) {
    return StudentCourseLevelProgress.find(query)
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async getById(id) {
    return StudentCourseLevelProgress.findById(id).lean();
  }

  async create(data) {
    return StudentCourseLevelProgress.create(data);
  }

  async update(id, data) {
    return StudentCourseLevelProgress.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    return StudentCourseLevelProgress.findByIdAndDelete(id).lean();
  }

  async deleteMany(query) {
    return StudentCourseLevelProgress.deleteMany(query);
  }
}

module.exports = new StudentCourseLevelProgressService();
