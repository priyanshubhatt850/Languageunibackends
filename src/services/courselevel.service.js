const CourseLevel = require("../models/CourseLevel");

class CourseLevelService {
  async list({ sort, limit, skip, fields }) {
    return CourseLevel.find({})
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async filter(query, { sort, limit, skip, fields }) {
    return CourseLevel.find(query)
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async getById(id) {
    return CourseLevel.findById(id).lean();
  }

  async create(data) {
    return CourseLevel.create(data);
  }

  async update(id, data) {
    return CourseLevel.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    return CourseLevel.findByIdAndDelete(id).lean();
  }

  async deleteMany(query) {
    return CourseLevel.deleteMany(query);
  }
}

module.exports = new CourseLevelService();
