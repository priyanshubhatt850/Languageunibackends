const courseService = require("../services/course.service");

class CourseController {
  async list(req, res, next) {
    try {
      const data = await courseService.list(req.query);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async filter(req, res, next) {
    try {
      const data = await courseService.filter(req.body, req.query);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const data = await courseService.getById(req.params.id);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const data = await courseService.create(req.body);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const data = await courseService.update(req.params.id, req.body);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const data = await courseService.delete(req.params.id);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async deleteMany(req, res, next) {
    try {
      const data = await courseService.deleteMany(req.body);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CourseController();
