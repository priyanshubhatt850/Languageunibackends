const express = require("express");
const router = express.Router();

// Middleware
const { authMiddleware } = require("../middleware");

// Controllers
const { userpointsController } = require("../controllers");

// Routes
router.get("/", userpointsController.list);
router.get("/:id", userpointsController.getById);
router.put("/:id", authMiddleware, userpointsController.update);
router.delete("/:id", authMiddleware, userpointsController.delete);
router.post("/filter", userpointsController.filter);
router.post("/", authMiddleware, userpointsController.create);
router.post("/deleteMany", authMiddleware, userpointsController.deleteMany);
module.exports = router;
