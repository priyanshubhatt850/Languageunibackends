const BaseController = require('./BaseController');
const catchAsync = require('../utils/catchAsync');
const service = require('../services/teachingsession.service');

class TeachingSessionController extends BaseController {
  constructor() {
    super(service);
  }

  getActiveSession = catchAsync(async (req, res) => {
    const data = await service.getActiveSession(req.params.instructorId);
    return res.json({ success: true, data });
  });

  startClass = catchAsync(async (req, res) => {
    const data = await service.startClass(req.body);
    return res.json({ success: true, data });
  });

  endClass = catchAsync(async (req, res) => {
    const data = await service.endClass(req.params.id);
    return res.json({ success: true, data });
  });
}

module.exports = new TeachingSessionController();
