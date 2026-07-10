const express = require("express");
const router = express.Router();

// Middleware
const { authMiddleware } = require("../middleware");

// Controllers
const { studymaterialController } = require("../controllers");

// Routes
router.get("/", studymaterialController.list);
router.get("/:id", studymaterialController.getById);
router.put("/:id", authMiddleware, studymaterialController.update);
router.delete("/:id", authMiddleware, studymaterialController.delete);
router.post("/filter", studymaterialController.filter);
router.post("/", authMiddleware, studymaterialController.create);
router.post("/deleteMany", authMiddleware, studymaterialController.deleteMany);
module.exports = router;
