const express = require("express");
const router = express.Router();

// Middleware
// const { authMiddleware } = require("../middleware");

// Controllers
const { chatconversationController } = require("../controllers");

// Routes
router.get("/", chatconversationController.list);
router.get("/:id", chatconversationController.getById);
router.put("/:id", chatconversationController.update);
router.delete("/:id", chatconversationController.delete);
router.post("/filter", chatconversationController.filter);
router.post("/", chatconversationController.create);
router.post("/deleteMany", chatconversationController.deleteMany);
module.exports = router;
