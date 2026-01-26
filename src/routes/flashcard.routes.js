const express = require("express");
const router = express.Router();

// Middleware
// const { authMiddleware } = require("../middleware");

// Controllers
const { flashcardController } = require("../controllers");

// Routes
router.get("/", flashcardController.list);
router.get("/:id", flashcardController.getById);
router.put("/:id", flashcardController.update);
router.delete("/:id", flashcardController.delete);
router.post("/filter", flashcardController.filter);
router.post("/", flashcardController.create);
router.post("/deleteMany", flashcardController.deleteMany);
module.exports = router;
