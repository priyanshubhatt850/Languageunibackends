const express = require("express");
const router = express.Router();

// Middleware
// const { authMiddleware } = require("../middleware");

// Controllers
const { notificationController } = require("../controllers");

// Routes
router.get("/", notificationController.list);
router.get("/:id", notificationController.getById);
router.put("/:id", notificationController.update);
router.delete("/:id", notificationController.delete);
router.post("/filter", notificationController.filter);
router.post("/", notificationController.create);
router.post("/deleteMany", notificationController.deleteMany);
module.exports = router;
