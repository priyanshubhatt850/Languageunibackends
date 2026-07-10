const express = require("express");
const router = express.Router();

// Middleware
const { authMiddleware } = require("../middleware");

// Controllers
const { exerciseattemptController } = require("../controllers");

// Routes
router.get("/", exerciseattemptController.list);
router.get("/:id", exerciseattemptController.getById);
router.put("/:id", authMiddleware, exerciseattemptController.update);
router.delete("/:id", authMiddleware, exerciseattemptController.delete);
router.post("/filter", exerciseattemptController.filter);
router.post("/", authMiddleware, exerciseattemptController.create);
router.post("/deleteMany", authMiddleware, exerciseattemptController.deleteMany);
module.exports = router;
