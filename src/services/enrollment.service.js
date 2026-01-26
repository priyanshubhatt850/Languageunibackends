const Enrollment = require("../models/Enrollment");

class EnrollmentService {
  async list({ sort, limit, skip, fields }) {
    return Enrollment.find({})
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async filter(query, { sort, limit, skip, fields }) {
    return Enrollment.find(query)
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async getById(id) {
    return Enrollment.findById(id).lean();
  }

  async create(data) {
    return Enrollment.create(data);
  }

  async update(id, data) {
    return Enrollment.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    return Enrollment.findByIdAndDelete(id).lean();
  }

  async deleteMany(query) {
    return Enrollment.deleteMany(query);
  }
}

module.exports = new EnrollmentService();
