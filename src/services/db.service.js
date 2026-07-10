class DbService {
  static async findOne(Model, query) {
    return Model.findOne(query).lean();
  }

  static async update(Model, query, data) {
    return Model.updateOne(query, data, { new: true });
  }

  static async create(Model, data) {
    return Model.create(data);
  }

  static async find(Model, query) {
    return Model.find(query).lean();
  }
}

module.exports = DbService;
