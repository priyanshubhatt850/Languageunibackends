const express = require("express");
const router = express.Router();

// Middleware
const { authMiddleware } = require("../middleware");

// Controllers
const { notificationController } = require("../controllers");

// Routes
router.get("/", notificationController.list);
router.get("/:id", notificationController.getById);
router.put("/:id", authMiddleware, notificationController.update);
router.delete("/:id", authMiddleware, notificationController.delete);
router.post("/filter", notificationController.filter);
router.post("/", authMiddleware, notificationController.create);
router.post("/deleteMany", authMiddleware, notificationController.deleteMany);
module.exports = router;
