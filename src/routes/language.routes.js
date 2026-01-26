const express = require("express");
const router = express.Router();

// Middleware
// const { authMiddleware } = require("../middleware");

// Controllers
const { languageController } = require("../controllers");

// Routes
router.get("/", languageController.list);
router.get("/:id", languageController.getById);
router.put("/:id", languageController.update);
router.delete("/:id", languageController.delete);
router.post("/filter", languageController.filter);
router.post("/", languageController.create);
router.post("/deleteMany", languageController.deleteMany);
module.exports = router;
