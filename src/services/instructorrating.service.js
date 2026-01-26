const InstructorRating = require("../models/InstructorRating");

class InstructorRatingService {
  async list({ sort, limit, skip, fields }) {
    return InstructorRating.find({})
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async filter(query, { sort, limit, skip, fields }) {
    return InstructorRating.find(query)
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async getById(id) {
    return InstructorRating.findById(id).lean();
  }

  async create(data) {
    return InstructorRating.create(data);
  }

  async update(id, data) {
    return InstructorRating.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    return InstructorRating.findByIdAndDelete(id).lean();
  }

  async deleteMany(query) {
    return InstructorRating.deleteMany(query);
  }
}

module.exports = new InstructorRatingService();
