const instructorwallettransactionService = require("../services/instructorwallettransaction.service");

class InstructorWalletTransactionController {
  async list(req, res, next) {
    try {
      const data = await instructorwallettransactionService.list(req.query);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async filter(req, res, next) {
    try {
      const data = await instructorwallettransactionService.filter(req.body, req.query);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const data = await instructorwallettransactionService.getById(req.params.id);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const data = await instructorwallettransactionService.create(req.body);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const data = await instructorwallettransactionService.update(req.params.id, req.body);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const data = await instructorwallettransactionService.delete(req.params.id);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async deleteMany(req, res, next) {
    try {
      const data = await instructorwallettransactionService.deleteMany(req.body);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new InstructorWalletTransactionController();
