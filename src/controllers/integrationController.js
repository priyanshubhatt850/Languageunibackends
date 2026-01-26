const integrationService = require("../services/integration.service");

class IntegrationController {
  async uploadFile(req, res) {
    try {
      const fileUrl = await integrationService.uploadFile(req.file);
      res.json({ file_url: fileUrl });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}

module.exports = new IntegrationController();
