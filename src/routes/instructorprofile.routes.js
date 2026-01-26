const express = require("express");
const router = express.Router();

// Middleware
const { authMiddleware } = require("../middleware");

// Controllers
const { instructorprofileController } = require("../controllers");

// Routes
router.get("/", instructorprofileController.list);
router.get("/:id", instructorprofileController.getById);
router.put("/:id", instructorprofileController.update);
router.delete("/:id", instructorprofileController.delete);
router.post("/filter", instructorprofileController.filter);
router.post("/", authMiddleware,instructorprofileController.create);
router.post("/deleteMany", instructorprofileController.deleteMany);
module.exports = router;
