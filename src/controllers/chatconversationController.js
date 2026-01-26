const chatconversationService = require("../services/chatconversation.service");

class ChatConversationController {
  async list(req, res, next) {
    try {
      const data = await chatconversationService.list(req.query);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async filter(req, res, next) {
    try {
      const data = await chatconversationService.filter(req.body, req.query);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const data = await chatconversationService.getById(req.params.id);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const data = await chatconversationService.create(req.body);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const data = await chatconversationService.update(req.params.id, req.body);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const data = await chatconversationService.delete(req.params.id);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async deleteMany(req, res, next) {
    try {
      const data = await chatconversationService.deleteMany(req.body);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ChatConversationController();
