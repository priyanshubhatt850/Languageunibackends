const studentcourselevelprogressService = require("../services/studentcourselevelprogress.service");

class StudentCourseLevelProgressController {
  async list(req, res, next) {
    try {
      const data = await studentcourselevelprogressService.list(req.query);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async filter(req, res, next) {
    try {
      const data = await studentcourselevelprogressService.filter(req.body, req.query);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const data = await studentcourselevelprogressService.getById(req.params.id);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const data = await studentcourselevelprogressService.create(req.body);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const data = await studentcourselevelprogressService.update(req.params.id, req.body);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const data = await studentcourselevelprogressService.delete(req.params.id);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async deleteMany(req, res, next) {
    try {
      const data = await studentcourselevelprogressService.deleteMany(req.body);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new StudentCourseLevelProgressController();
