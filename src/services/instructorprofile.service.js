const InstructorProfile = require("../models/InstructorProfile");
const UserModel = require("../models/User");
class InstructorProfileService {
  async list({ sort, limit, skip, fields }) {
    return InstructorProfile.find({})
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async filter(query, { sort, limit, skip, fields }) {
    return InstructorProfile.find(query)
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async getById(id) {
    return InstructorProfile.findById(id).lean();
  }

  async create(data,userId) {
    data.user_id = userId;
    const updateIspforileCompleted = await UserModel.findByIdAndUpdate(
      userId,
      { profileCompleted: true },
      { new: true }
    ).lean();
    return InstructorProfile.create(data);
  }

  async update(id, data) {
    return InstructorProfile.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    return InstructorProfile.findByIdAndDelete(id).lean();
  }

  async deleteMany(query) {
    return InstructorProfile.deleteMany(query);
  }
}

module.exports = new InstructorProfileService();
