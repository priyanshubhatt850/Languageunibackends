const express = require("express");
const router = express.Router();

// Middleware
const { authMiddleware } = require("../middleware");

// Controllers
const { quizattemptController } = require("../controllers");

// Routes
router.get("/", quizattemptController.list);
router.get("/:id", quizattemptController.getById);
router.put("/:id", authMiddleware, quizattemptController.update);
router.delete("/:id", authMiddleware, quizattemptController.delete);
router.post("/filter", quizattemptController.filter);
router.post("/", authMiddleware, quizattemptController.create);
router.post("/deleteMany", authMiddleware, quizattemptController.deleteMany);
module.exports = router;
