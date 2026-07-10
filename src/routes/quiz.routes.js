const express = require("express");
const router = express.Router();

// Middleware
const { authMiddleware } = require("../middleware");

// Controllers
const { quizController } = require("../controllers");

// Routes
router.get("/", quizController.list);
router.get("/:id", quizController.getById);
router.put("/:id", authMiddleware, quizController.update);
router.delete("/:id", authMiddleware, quizController.delete);
router.post("/filter", quizController.filter);
router.post("/", authMiddleware, quizController.create);
router.post("/deleteMany", authMiddleware, quizController.deleteMany);
module.exports = router;
