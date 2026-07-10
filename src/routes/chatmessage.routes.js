const express = require("express");
const router = express.Router();

// Middleware
const { authMiddleware } = require("../middleware");

// Controllers
const { chatmessageController } = require("../controllers");

// Routes
router.get("/", chatmessageController.list);
router.get("/:id", chatmessageController.getById);
router.put("/:id", authMiddleware, chatmessageController.update);
router.delete("/:id", authMiddleware, chatmessageController.delete);
router.post("/filter", chatmessageController.filter);
router.post("/", authMiddleware, chatmessageController.create);
router.post("/deleteMany", authMiddleware, chatmessageController.deleteMany);
module.exports = router;
