const express = require("express");
const router = express.Router();

// Middleware
// const { authMiddleware } = require("../middleware");

// Controllers
const { lessonController } = require("../controllers");

// Routes
router.get("/", lessonController.list);
router.get("/:id", lessonController.getById);
router.put("/:id", lessonController.update);
router.delete("/:id", lessonController.delete);
router.post("/filter", lessonController.filter);
router.post("/", lessonController.create);
router.post("/deleteMany", lessonController.deleteMany);
module.exports = router;
