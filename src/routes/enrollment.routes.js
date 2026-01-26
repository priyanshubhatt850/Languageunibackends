const express = require("express");
const router = express.Router();

// Middleware
// const { authMiddleware } = require("../middleware");

// Controllers
const { enrollmentController } = require("../controllers");

// Routes
router.get("/", enrollmentController.list);
router.get("/:id", enrollmentController.getById);
router.put("/:id", enrollmentController.update);
router.delete("/:id", enrollmentController.delete);
router.post("/filter", enrollmentController.filter);
router.post("/", enrollmentController.create);
router.post("/deleteMany", enrollmentController.deleteMany);
module.exports = router;
