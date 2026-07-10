const express = require("express");
const router = express.Router();

// Middleware
const { authMiddleware } = require("../middleware");

// Controllers
const { instructorratingController } = require("../controllers");

// Routes
router.get("/", instructorratingController.list);
router.get("/:id", instructorratingController.getById);
router.put("/:id", authMiddleware, instructorratingController.update);
router.delete("/:id", authMiddleware, instructorratingController.delete);
router.post("/filter", instructorratingController.filter);
router.post("/", authMiddleware, instructorratingController.create);
router.post("/deleteMany", authMiddleware, instructorratingController.deleteMany);
module.exports = router;
