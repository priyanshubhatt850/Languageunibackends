const express = require("express");
const router = express.Router();

// Middleware
// const { authMiddleware } = require("../middleware");

// Controllers
const { badgeController } = require("../controllers");

// Routes
router.get("/", badgeController.list);
router.get("/:id", badgeController.getById);
router.put("/:id", badgeController.update);
router.delete("/:id", badgeController.delete);
router.post("/filter", badgeController.filter);
router.post("/", badgeController.create);
router.post("/deleteMany", badgeController.deleteMany);
module.exports = router;
