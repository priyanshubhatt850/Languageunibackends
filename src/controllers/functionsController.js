const emailService = require("../services/email.service");
const functionsService = require("../services/functions.service");
class FunctionsController {
  async sendOTP(req, res) {
    try {
      const { user, message } = await functionsService.getOTP(req.body);

      if (user) {
        await emailService.sendAllMail(
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

        return res.status(201).json({
          success: true,
          user,
          message,
        });
      }

      // ❗ only reached if user is falsy
      return res.status(400).json({
        success: false,
        message: message || "Unable to send email",
      });

    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
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
  async verifyGoogleToken(req, res) {
    try {
      const { user, token } = await functionsService.verifyGoogleToken(req.body);
      res.status(201).json({ success: true, user, token });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new FunctionsController();
