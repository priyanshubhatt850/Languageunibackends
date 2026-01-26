const express = require("express");
const router = express.Router();

// Middleware
// const { authMiddleware } = require("../middleware");

// Controllers
const { instructorratingController } = require("../controllers");

// Routes
router.get("/", instructorratingController.list);
router.get("/:id", instructorratingController.getById);
router.put("/:id", instructorratingController.update);
router.delete("/:id", instructorratingController.delete);
router.post("/filter", instructorratingController.filter);
router.post("/", instructorratingController.create);
router.post("/deleteMany", instructorratingController.deleteMany);
module.exports = router;
