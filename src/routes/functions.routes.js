const express = require("express");
  const router = express.Router();

  const functionsController = require("../controllers/functionsController");
  const { authMiddleware } = require("../middleware");

  router.post("/sendOTP", functionsController.sendOTP);
  router.post("/verifyOTP", functionsController.verifyOTP);

  module.exports = router;
  