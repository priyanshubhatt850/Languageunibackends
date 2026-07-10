const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { authMiddleware } = require("../middleware");
const { validate } = require("../middleware/validate");
const authSchemas = require("../validators/auth.validator");

router.post("/register", validate(authSchemas.register), authController.register);
router.post("/login", validate(authSchemas.login), authController.login);
router.get("/me", authMiddleware, authController.me);
router.put("/me", authMiddleware, validate(authSchemas.updateMe), authController.updateMe);

module.exports = router;
  