const express = require("express");
const router = express.Router();

// Middleware
// const { authMiddleware } = require("../middleware");

// Controllers
const { exerciseattemptController } = require("../controllers");

// Routes
router.get("/", exerciseattemptController.list);
router.get("/:id", exerciseattemptController.getById);
router.put("/:id", exerciseattemptController.update);
router.delete("/:id", exerciseattemptController.delete);
router.post("/filter", exerciseattemptController.filter);
router.post("/", exerciseattemptController.create);
router.post("/deleteMany", exerciseattemptController.deleteMany);
module.exports = router;
