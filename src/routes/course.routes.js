const express = require("express");
const router = express.Router();

// Middleware
// const { authMiddleware } = require("../middleware");

// Controllers
const { courseController } = require("../controllers");

// Routes
router.get("/", courseController.list);
router.get("/:id", courseController.getById);
router.put("/:id", courseController.update);
router.delete("/:id", courseController.delete);
router.post("/filter", courseController.filter);
router.post("/", courseController.create);
router.post("/deleteMany", courseController.deleteMany);
module.exports = router;
