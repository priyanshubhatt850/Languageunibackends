const express = require("express");
const router = express.Router();

// Middleware
// const { authMiddleware } = require("../middleware");

// Controllers
const { quizController } = require("../controllers");

// Routes
router.get("/", quizController.list);
router.get("/:id", quizController.getById);
router.put("/:id", quizController.update);
router.delete("/:id", quizController.delete);
router.post("/filter", quizController.filter);
router.post("/", quizController.create);
router.post("/deleteMany", quizController.deleteMany);
module.exports = router;
