const express = require("express");
const router = express.Router();

// Middleware
// const { authMiddleware } = require("../middleware");

// Controllers
const { messageController } = require("../controllers");

// Routes
router.get("/", messageController.list);
router.get("/:id", messageController.getById);
router.put("/:id", messageController.update);
router.delete("/:id", messageController.delete);
router.post("/filter", messageController.filter);
router.post("/", messageController.create);
router.post("/deleteMany", messageController.deleteMany);
module.exports = router;
