const enrollmentService = require("../services/enrollment.service");

class EnrollmentController {
  async list(req, res, next) {
    try {
      const data = await enrollmentService.list(req.query);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async filter(req, res, next) {
    try {
      const data = await enrollmentService.filter(req.body, req.query);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const data = await enrollmentService.getById(req.params.id);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const data = await enrollmentService.create(req.body);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const data = await enrollmentService.update(req.params.id, req.body);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const data = await enrollmentService.delete(req.params.id);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async deleteMany(req, res, next) {
    try {
      const data = await enrollmentService.deleteMany(req.body);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }
  async startPaypalPayment(req,res,next){
    try {
      const data = await enrollmentService.startPaypalPayment(req);
      return res.json(data);
    } catch(error){
      next(error);
    }
  }
  async paypalSuccess (req,res,next){
    try {
   const data = await enrollmentService.paypalSuccess(req)
   return res.json(data)
    } catch(error){
      next(error)
    }
  }
}

module.exports = new EnrollmentController();
