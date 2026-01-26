const express = require("express");
const router = express.Router();

// Middleware
// const { authMiddleware } = require("../middleware");

// Controllers
const { courselevelController } = require("../controllers");

// Routes
router.get("/", courselevelController.list);
router.get("/:id", courselevelController.getById);
router.put("/:id", courselevelController.update);
router.delete("/:id", courselevelController.delete);
router.post("/filter", courselevelController.filter);
router.post("/", courselevelController.create);
router.post("/deleteMany", courselevelController.deleteMany);
module.exports = router;
