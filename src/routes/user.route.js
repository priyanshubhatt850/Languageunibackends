const express = require("express");
const router = express.Router();

// Middleware
// const { authMiddleware } = require("../middleware");

// Controllers
const { userController } = require("../controllers");

// Routes
router.get("/", userController.list);
router.get("/:id", userController.getById);
router.put("/:id", userController.update);
router.delete("/:id", userController.delete);
router.post("/filter", userController.filter);
router.post("/", userController.create);
router.post("/deleteMany", userController.deleteMany);
module.exports = router;
