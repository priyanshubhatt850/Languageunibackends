const express = require("express");
const router = express.Router();

// Middleware
const { authMiddleware } = require("../middleware");

// Controllers
const { messageController } = require("../controllers");

// Routes
router.get("/", messageController.list);
router.get("/:id", messageController.getById);
router.put("/:id", authMiddleware, messageController.update);
router.delete("/:id", authMiddleware, messageController.delete);
router.post("/filter", messageController.filter);
router.post("/", authMiddleware, messageController.create);
router.post("/deleteMany", authMiddleware, messageController.deleteMany);
module.exports = router;
