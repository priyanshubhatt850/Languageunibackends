const express = require("express");
const router = express.Router();

// Middleware
const { authMiddleware } = require("../middleware");

// Controllers
const { instructorwalletController } = require("../controllers");

// Routes
router.get("/", instructorwalletController.list);
router.get("/:id", instructorwalletController.getById);
router.put("/:id", authMiddleware, instructorwalletController.update);
router.delete("/:id", authMiddleware, instructorwalletController.delete);
router.post("/filter", instructorwalletController.filter);
router.post("/", authMiddleware, instructorwalletController.create);
router.post("/deleteMany", authMiddleware, instructorwalletController.deleteMany);
module.exports = router;
