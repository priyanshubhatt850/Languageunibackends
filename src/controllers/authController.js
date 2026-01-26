const authService = require("../services/auth.service");

  class AuthController {
    async register(req, res) {
      try {
        const { user, token } = await authService.register(req.body);
        res.status(201).json({ success: true, user, token });
      } catch (err) {
        res.status(400).json({ success: false, message: err.message });
      }
    }
  
    async login(req, res) {
      try {
        const { email, password } = req.body;
        const { user, token } = await authService.login(email, password);
        res.json({ success: true, user, token });
      } catch (err) {
        res.status(401).json({ success: false, message: err.message });
      }
    }
  
    async me(req, res) {
      try {
        const user = await authService.getMe(req.user._id);
        res.json(user);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    }
  
    async updateMe(req, res) {
      try {
        const user = await authService.updateMe(req.user._id, req.body);
        res.json(user);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    }
  }
  
  module.exports = new AuthController();
  