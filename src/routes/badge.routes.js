const express = require("express");
const router = express.Router();

// Middleware
const { authMiddleware } = require("../middleware");

// Controllers
const { badgeController } = require("../controllers");

// Routes
router.get("/", badgeController.list);
router.get("/:id", badgeController.getById);
router.put("/:id", authMiddleware, badgeController.update);
router.delete("/:id", authMiddleware, badgeController.delete);
router.post("/filter", badgeController.filter);
router.post("/", authMiddleware, badgeController.create);
router.post("/deleteMany", authMiddleware, badgeController.deleteMany);
module.exports = router;
