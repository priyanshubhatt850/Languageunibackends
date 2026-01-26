const express = require("express");
const router = express.Router();

// Middleware
// const { authMiddleware } = require("../middleware");

// Controllers
const { chatmessageController } = require("../controllers");

// Routes
router.get("/", chatmessageController.list);
router.get("/:id", chatmessageController.getById);
router.put("/:id", chatmessageController.update);
router.delete("/:id", chatmessageController.delete);
router.post("/filter", chatmessageController.filter);
router.post("/", chatmessageController.create);
router.post("/deleteMany", chatmessageController.deleteMany);
module.exports = router;
