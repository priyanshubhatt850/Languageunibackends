const express = require("express");
const router = express.Router();

// Middleware
const { authMiddleware } = require("../middleware");

// Controllers
const { flashcardController } = require("../controllers");

// Routes
router.get("/", flashcardController.list);
router.get("/:id", flashcardController.getById);
router.put("/:id", authMiddleware, flashcardController.update);
router.delete("/:id", authMiddleware, flashcardController.delete);
router.post("/filter", flashcardController.filter);
router.post("/", authMiddleware, flashcardController.create);
router.post("/deleteMany", authMiddleware, flashcardController.deleteMany);
module.exports = router;
