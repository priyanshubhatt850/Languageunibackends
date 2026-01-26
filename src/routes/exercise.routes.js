const express = require("express");
const router = express.Router();

// Middleware
// const { authMiddleware } = require("../middleware");

// Controllers
const { exerciseController } = require("../controllers");

// Routes
router.get("/", exerciseController.list);
router.get("/:id", exerciseController.getById);
router.put("/:id", exerciseController.update);
router.delete("/:id", exerciseController.delete);
router.post("/filter", exerciseController.filter);
router.post("/", exerciseController.create);
router.post("/deleteMany", exerciseController.deleteMany);
module.exports = router;
