const express = require("express");
const router = express.Router();

// Middleware
const { authMiddleware } = require("../middleware");

// Controllers
const { userController } = require("../controllers");

// Routes
router.get("/", userController.list);
router.get("/:id", userController.getById);
router.put("/:id", authMiddleware, userController.update);
router.delete("/:id", authMiddleware, userController.delete);
router.post("/filter", userController.filter);
router.post("/", authMiddleware, userController.create);
router.post("/deleteMany", authMiddleware, userController.deleteMany);
module.exports = router;
