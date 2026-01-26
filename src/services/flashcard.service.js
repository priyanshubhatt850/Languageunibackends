const Flashcard = require("../models/Flashcard");

class FlashcardService {
  async list({ sort, limit, skip, fields }) {
    return Flashcard.find({})
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async filter(query, { sort, limit, skip, fields }) {
    return Flashcard.find(query)
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async getById(id) {
    return Flashcard.findById(id).lean();
  }

  async create(data) {
    return Flashcard.create(data);
  }

  async update(id, data) {
    return Flashcard.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    return Flashcard.findByIdAndDelete(id).lean();
  }

  async deleteMany(query) {
    return Flashcard.deleteMany(query);
  }
}

module.exports = new FlashcardService();
