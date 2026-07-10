const BaseController = require('./BaseController');
const catchAsync = require('../utils/catchAsync');
const service = require('../services/instructorprofile.service');

class InstructorProfileController extends BaseController {
  constructor() {
    super(service);
  }

  create = catchAsync(async (req, res) => {
    const data = await service.create(req.body, req.user._id);
    return res.status(201).json(data);
  });
}

module.exports = new InstructorProfileController();
