const express = require("express");
const router = express.Router();

// Middleware
// const { authMiddleware } = require("../middleware");

// Controllers
const { reviewController } = require("../controllers");

// Routes
router.get("/", reviewController.list);
router.get("/:id", reviewController.getById);
router.put("/:id", reviewController.update);
router.delete("/:id", reviewController.delete);
router.post("/filter", reviewController.filter);
router.post("/", reviewController.create);
router.post("/deleteMany", reviewController.deleteMany);
module.exports = router;
