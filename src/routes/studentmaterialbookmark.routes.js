const express = require("express");
const router = express.Router();

// Middleware
// const { authMiddleware } = require("../middleware");

// Controllers
const { studentmaterialbookmarkController } = require("../controllers");

// Routes
router.get("/", studentmaterialbookmarkController.list);
router.get("/:id", studentmaterialbookmarkController.getById);
router.put("/:id", studentmaterialbookmarkController.update);
router.delete("/:id", studentmaterialbookmarkController.delete);
router.post("/filter", studentmaterialbookmarkController.filter);
router.post("/", studentmaterialbookmarkController.create);
router.post("/deleteMany", studentmaterialbookmarkController.deleteMany);
module.exports = router;
