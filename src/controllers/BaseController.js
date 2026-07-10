const catchAsync = require('../utils/catchAsync');

class BaseController {
  constructor(service) {
    this.service = service;
    this.list = this.list.bind(this);
    this.filter = this.filter.bind(this);
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteMany = this.deleteMany.bind(this);
  }

  list = catchAsync(async (req, res) => {
    const { sort, limit, skip, fields } = req.query;
    const data = await this.service.list({ sort, limit, skip, fields });
    return res.json(data);
  });

  filter = catchAsync(async (req, res) => {
    const { sort, limit, skip, fields, ...filterQuery } = req.body;
    const data = await this.service.filter(filterQuery, { sort, limit, skip, fields });
    return res.json(data);
  });

  getById = catchAsync(async (req, res) => {
    const data = await this.service.getById(req.params.id);
    return res.json(data);
  });

  create = catchAsync(async (req, res) => {
    const data = await this.service.create(req.body);
    return res.status(201).json(data);
  });

  update = catchAsync(async (req, res) => {
    const data = await this.service.update(req.params.id, req.body);
    return res.json(data);
  });

  delete = catchAsync(async (req, res) => {
    const data = await this.service.delete(req.params.id);
    return res.json(data);
  });

  deleteMany = catchAsync(async (req, res) => {
    const data = await this.service.deleteMany(req.body);
    return res.json(data);
  });
}

module.exports = BaseController;
