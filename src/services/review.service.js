const Review = require("../models/Review");

class ReviewService {
  async list({ sort, limit, skip, fields }) {
    return Review.find({})
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async filter(query, { sort, limit, skip, fields }) {
    return Review.find(query)
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async getById(id) {
    return Review.findById(id).lean();
  }

  async create(data) {
    return Review.create(data);
  }

  async update(id, data) {
    return Review.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    return Review.findByIdAndDelete(id).lean();
  }

  async deleteMany(query) {
    return Review.deleteMany(query);
  }
}

module.exports = new ReviewService();
