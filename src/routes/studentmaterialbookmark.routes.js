const express = require("express");
const router = express.Router();

// Middleware
const { authMiddleware } = require("../middleware");

// Controllers
const { studentmaterialbookmarkController } = require("../controllers");

// Routes
router.get("/", studentmaterialbookmarkController.list);
router.get("/:id", studentmaterialbookmarkController.getById);
router.put("/:id", authMiddleware, studentmaterialbookmarkController.update);
router.delete("/:id", authMiddleware, studentmaterialbookmarkController.delete);
router.post("/filter", studentmaterialbookmarkController.filter);
router.post("/", authMiddleware, studentmaterialbookmarkController.create);
router.post("/deleteMany", authMiddleware, studentmaterialbookmarkController.deleteMany);
module.exports = router;
