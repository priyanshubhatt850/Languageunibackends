const express = require("express");
const router = express.Router();

// Middleware
const { authMiddleware } = require("../middleware");

// Controllers
const { courseController } = require("../controllers");

// Routes
router.get("/", courseController.list);
router.get("/:id", courseController.getById);
router.put("/:id", authMiddleware, courseController.update);
router.delete("/:id", authMiddleware, courseController.delete);
router.post("/filter", courseController.filter);
router.post("/", authMiddleware, courseController.create);
router.post("/deleteMany", authMiddleware, courseController.deleteMany);
module.exports = router;
