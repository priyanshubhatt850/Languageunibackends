const express = require("express");
const router = express.Router();

// Middleware
const { authMiddleware } = require("../middleware");

// Controllers
const { reviewController } = require("../controllers");

// Routes
router.get("/", reviewController.list);
router.get("/:id", reviewController.getById);
router.put("/:id", authMiddleware, reviewController.update);
router.delete("/:id", authMiddleware, reviewController.delete);
router.post("/filter", reviewController.filter);
router.post("/", authMiddleware, reviewController.create);
router.post("/deleteMany", authMiddleware, reviewController.deleteMany);
module.exports = router;
