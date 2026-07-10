const express = require("express");
const router = express.Router();

// Middleware
const { authMiddleware } = require("../middleware");

// Controllers
const { exerciseController } = require("../controllers");

// Routes
router.get("/", exerciseController.list);
router.get("/:id", exerciseController.getById);
router.put("/:id", authMiddleware, exerciseController.update);
router.delete("/:id", authMiddleware, exerciseController.delete);
router.post("/filter", exerciseController.filter);
router.post("/", authMiddleware, exerciseController.create);
router.post("/deleteMany", authMiddleware, exerciseController.deleteMany);
module.exports = router;
