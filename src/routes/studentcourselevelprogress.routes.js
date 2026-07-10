const express = require("express");
const router = express.Router();

// Middleware
const { authMiddleware } = require("../middleware");

// Controllers
const { studentcourselevelprogressController } = require("../controllers");

// Routes
router.get("/", studentcourselevelprogressController.list);
router.get("/:id", studentcourselevelprogressController.getById);
router.put("/:id", authMiddleware, studentcourselevelprogressController.update);
router.delete("/:id", authMiddleware, studentcourselevelprogressController.delete);
router.post("/filter", studentcourselevelprogressController.filter);
router.post("/", authMiddleware, studentcourselevelprogressController.create);
router.post("/deleteMany", authMiddleware, studentcourselevelprogressController.deleteMany);
module.exports = router;
