const BaseService = require('./BaseService');
const InstructorProfile = require('../models/InstructorProfile');
const UserModel = require('../models/User');

class InstructorProfileService extends BaseService {
  constructor() {
    super(InstructorProfile);
  }

  async create(data, userId) {
    data.user_id = userId;
    await UserModel.findByIdAndUpdate(
      userId,
      { profileCompleted: true },
      { new: true }
    ).lean();
    return InstructorProfile.create(data);
  }
}

module.exports = new InstructorProfileService();
