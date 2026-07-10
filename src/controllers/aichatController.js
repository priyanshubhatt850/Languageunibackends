const aiChatService = require('../services/aichat.service');

class AIChatController {
  async getHistory(req, res, next) {
    try {
      const data = await aiChatService.getHistory(req.user._id);
      return res.json({ success: true, history: data });
    } catch (err) {
      next(err);
    }
  }

  async sendMessage(req, res, next) {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ success: false, message: "Prompt is required" });
      }
      const data = await aiChatService.sendMessage(req.user._id, prompt);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async clearHistory(req, res, next) {
    try {
      const data = await aiChatService.clearHistory(req.user._id);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AIChatController();
