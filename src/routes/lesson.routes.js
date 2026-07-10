const express = require("express");
const router = express.Router();

// Middleware
const { authMiddleware } = require("../middleware");

// Controllers
const { lessonController } = require("../controllers");

// Routes
router.get("/", lessonController.list);
router.get("/:id", lessonController.getById);
router.put("/:id", authMiddleware, lessonController.update);
router.delete("/:id", authMiddleware, lessonController.delete);
router.post("/filter", lessonController.filter);
router.post("/", authMiddleware, lessonController.create);
router.post("/deleteMany", authMiddleware, lessonController.deleteMany);
module.exports = router;
