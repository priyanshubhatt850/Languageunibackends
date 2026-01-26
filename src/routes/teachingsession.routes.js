const express = require("express");
const router = express.Router();

// Middleware
// const { authMiddleware } = require("../middleware");

// Controllers
const { teachingsessionController } = require("../controllers");

// Routes
router.get("/", teachingsessionController.list);
router.get("/:id", teachingsessionController.getById);
router.put("/:id", teachingsessionController.update);
router.delete("/:id", teachingsessionController.delete);
router.post("/filter", teachingsessionController.filter);
router.post("/", teachingsessionController.create);
router.post("/deleteMany", teachingsessionController.deleteMany);
module.exports = router;
