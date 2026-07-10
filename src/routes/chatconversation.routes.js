const express = require("express");
const router = express.Router();

// Middleware
const { authMiddleware } = require("../middleware");

// Controllers
const { chatconversationController } = require("../controllers");

// Routes
router.get("/", chatconversationController.list);
router.get("/:id", chatconversationController.getById);
router.put("/:id", authMiddleware, chatconversationController.update);
router.delete("/:id", authMiddleware, chatconversationController.delete);
router.post("/filter", chatconversationController.filter);
router.post("/", authMiddleware, chatconversationController.create);
router.post("/deleteMany", authMiddleware, chatconversationController.deleteMany);
module.exports = router;
