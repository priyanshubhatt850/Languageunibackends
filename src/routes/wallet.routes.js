const express = require("express");
const router = express.Router();

// Middleware
const { authMiddleware } = require("../middleware");

// Controllers
const { walletController } = require("../controllers");

// Routes
router.get("/", walletController.list);
router.get("/:id", walletController.getById);
router.put("/:id", authMiddleware, walletController.update);
router.delete("/:id", authMiddleware, walletController.delete);
router.post("/filter", walletController.filter);
router.post("/", authMiddleware, walletController.create);
router.post("/deleteMany", authMiddleware, walletController.deleteMany);
module.exports = router;
