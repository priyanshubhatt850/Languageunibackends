const express = require("express");
const router = express.Router();

// Middleware
const { authMiddleware } = require("../middleware");

// Controllers
const { courselevelController } = require("../controllers");

// Routes
router.get("/", courselevelController.list);
router.get("/:id", courselevelController.getById);
router.put("/:id", authMiddleware, courselevelController.update);
router.delete("/:id", authMiddleware, courselevelController.delete);
router.post("/filter", courselevelController.filter);
router.post("/", authMiddleware, courselevelController.create);
router.post("/deleteMany", authMiddleware, courselevelController.deleteMany);
module.exports = router;
