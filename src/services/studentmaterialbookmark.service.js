const StudentMaterialBookmark = require("../models/StudentMaterialBookmark");

class StudentMaterialBookmarkService {
  async list({ sort, limit, skip, fields }) {
    return StudentMaterialBookmark.find({})
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async filter(query, { sort, limit, skip, fields }) {
    return StudentMaterialBookmark.find(query)
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async getById(id) {
    return StudentMaterialBookmark.findById(id).lean();
  }

  async create(data) {
    return StudentMaterialBookmark.create(data);
  }

  async update(id, data) {
    return StudentMaterialBookmark.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    return StudentMaterialBookmark.findByIdAndDelete(id).lean();
  }

  async deleteMany(query) {
    return StudentMaterialBookmark.deleteMany(query);
  }
}

module.exports = new StudentMaterialBookmarkService();
