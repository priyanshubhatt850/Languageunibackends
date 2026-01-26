const express = require("express");
const router = express.Router();

// Middleware
// const { authMiddleware } = require("../middleware");

// Controllers
const { instructorwalletController } = require("../controllers");

// Routes
router.get("/", instructorwalletController.list);
router.get("/:id", instructorwalletController.getById);
router.put("/:id", instructorwalletController.update);
router.delete("/:id", instructorwalletController.delete);
router.post("/filter", instructorwalletController.filter);
router.post("/", instructorwalletController.create);
router.post("/deleteMany", instructorwalletController.deleteMany);
module.exports = router;
