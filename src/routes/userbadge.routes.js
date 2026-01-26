const express = require("express");
const router = express.Router();

// Middleware
// const { authMiddleware } = require("../middleware");

// Controllers
const { userbadgeController } = require("../controllers");

// Routes
router.get("/", userbadgeController.list);
router.get("/:id", userbadgeController.getById);
router.put("/:id", userbadgeController.update);
router.delete("/:id", userbadgeController.delete);
router.post("/filter", userbadgeController.filter);
router.post("/", userbadgeController.create);
router.post("/deleteMany", userbadgeController.deleteMany);
module.exports = router;
