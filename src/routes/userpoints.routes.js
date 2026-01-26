const express = require("express");
const router = express.Router();

// Middleware
// const { authMiddleware } = require("../middleware");

// Controllers
const { userpointsController } = require("../controllers");

// Routes
router.get("/", userpointsController.list);
router.get("/:id", userpointsController.getById);
router.put("/:id", userpointsController.update);
router.delete("/:id", userpointsController.delete);
router.post("/filter", userpointsController.filter);
router.post("/", userpointsController.create);
router.post("/deleteMany", userpointsController.deleteMany);
module.exports = router;
