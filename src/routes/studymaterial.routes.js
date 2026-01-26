const express = require("express");
const router = express.Router();

// Middleware
// const { authMiddleware } = require("../middleware");

// Controllers
const { studymaterialController } = require("../controllers");

// Routes
router.get("/", studymaterialController.list);
router.get("/:id", studymaterialController.getById);
router.put("/:id", studymaterialController.update);
router.delete("/:id", studymaterialController.delete);
router.post("/filter", studymaterialController.filter);
router.post("/", studymaterialController.create);
router.post("/deleteMany", studymaterialController.deleteMany);
module.exports = router;
