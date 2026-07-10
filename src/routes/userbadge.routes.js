const express = require("express");
const router = express.Router();

// Middleware
const { authMiddleware } = require("../middleware");

// Controllers
const { userbadgeController } = require("../controllers");

// Routes
router.get("/", userbadgeController.list);
router.get("/:id", userbadgeController.getById);
router.put("/:id", authMiddleware, userbadgeController.update);
router.delete("/:id", authMiddleware, userbadgeController.delete);
router.post("/filter", userbadgeController.filter);
router.post("/", authMiddleware, userbadgeController.create);
router.post("/deleteMany", authMiddleware, userbadgeController.deleteMany);
module.exports = router;
