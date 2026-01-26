const StudyMaterial = require("../models/StudyMaterial");

class StudyMaterialService {
  async list({ sort, limit, skip, fields }) {
    return StudyMaterial.find({})
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async filter(query, { sort, limit, skip, fields }) {
    return StudyMaterial.find(query)
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async getById(id) {
    return StudyMaterial.findById(id).lean();
  }

  async create(data) {
    return StudyMaterial.create(data);
  }

  async update(id, data) {
    return StudyMaterial.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    return StudyMaterial.findByIdAndDelete(id).lean();
  }

  async deleteMany(query) {
    return StudyMaterial.deleteMany(query);
  }
}

module.exports = new StudyMaterialService();
