const express = require("express");
const router = express.Router();

// Middleware
// const { authMiddleware } = require("../middleware");

// Controllers
const { quizattemptController } = require("../controllers");

// Routes
router.get("/", quizattemptController.list);
router.get("/:id", quizattemptController.getById);
router.put("/:id", quizattemptController.update);
router.delete("/:id", quizattemptController.delete);
router.post("/filter", quizattemptController.filter);
router.post("/", quizattemptController.create);
router.post("/deleteMany", quizattemptController.deleteMany);
module.exports = router;
