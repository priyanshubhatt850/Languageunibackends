const emailService = require("../services/email.service");
const functionsService = require("../services/functions.service");
class FunctionsController {
  async sendOTP(req, res) {
    try {
      const { user } = await functionsService.getOTP(req.body);

      let resp = await emailService.sendAllMail(
        {
          email: user.email,
          otp: user.otp,
          role: user.service_type,
          expiryMinutes: 10,
        },
        user.email,
        "otp.ejs",
        "Your OTP for Pet Hostel Onboarding - Swoofi",
        "care@swoofi.app"
      );

      console.log("============> ", resp);
      res.status(201).json({ success: true, user });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
  async verifyOTP(req, res) {
    try {
      const { user, token } = await functionsService.verifyOTP(req.body);
      res.status(201).json({ success: true, user, token });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
}

module.exports = new FunctionsController();
