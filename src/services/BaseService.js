const { NotFoundError } = require('../utils/AppError');

class BaseService {
  constructor(Model) {
    this.Model = Model;
  }

  async list({ sort, limit, skip, fields } = {}) {
    let query = this.Model.find();
    if (sort) query = query.sort(sort);
    if (fields) query = query.select(fields);
    if (skip) query = query.skip(Number(skip));
    if (limit) query = query.limit(Number(limit));
    return query.lean();
  }

  async filter(filterQuery, { sort, limit, skip, fields } = {}) {
    let query = this.Model.find(filterQuery);
    if (sort) query = query.sort(sort);
    if (fields) query = query.select(fields);
    if (skip) query = query.skip(Number(skip));
    if (limit) query = query.limit(Number(limit));
    return query.lean();
  }

  async getById(id) {
    const doc = await this.Model.findById(id).lean();
    if (!doc) throw new NotFoundError(`${this.Model.modelName} not found`);
    return doc;
  }

  async create(data) {
    return this.Model.create(data);
  }

  async update(id, data) {
    const doc = await this.Model.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!doc) throw new NotFoundError(`${this.Model.modelName} not found`);
    return doc;
  }

  async delete(id) {
    const doc = await this.Model.findByIdAndDelete(id);
    if (!doc) throw new NotFoundError(`${this.Model.modelName} not found`);
    return doc;
  }

  async deleteMany(query) {
    return this.Model.deleteMany(query);
  }
}

module.exports = BaseService;
