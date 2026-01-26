const express = require("express");
const router = express.Router();

// Middleware
// const { authMiddleware } = require("../middleware");

// Controllers
const { studentcourselevelprogressController } = require("../controllers");

// Routes
router.get("/", studentcourselevelprogressController.list);
router.get("/:id", studentcourselevelprogressController.getById);
router.put("/:id", studentcourselevelprogressController.update);
router.delete("/:id", studentcourselevelprogressController.delete);
router.post("/filter", studentcourselevelprogressController.filter);
router.post("/", studentcourselevelprogressController.create);
router.post("/deleteMany", studentcourselevelprogressController.deleteMany);
module.exports = router;
