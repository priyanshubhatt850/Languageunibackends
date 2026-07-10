const express = require("express");
const router = express.Router();

// Middleware
const { authMiddleware } = require("../middleware");

// Controllers
const { languageController } = require("../controllers");

// Routes
router.get("/", languageController.list);
router.get("/:id", languageController.getById);
router.put("/:id", authMiddleware, languageController.update);
router.delete("/:id", authMiddleware, languageController.delete);
router.post("/filter", languageController.filter);
router.post("/", authMiddleware, languageController.create);
router.post("/deleteMany", authMiddleware, languageController.deleteMany);
module.exports = router;
