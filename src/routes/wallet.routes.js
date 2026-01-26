const express = require("express");
const router = express.Router();

// Middleware
// const { authMiddleware } = require("../middleware");

// Controllers
const { walletController } = require("../controllers");

// Routes
router.get("/", walletController.list);
router.get("/:id", walletController.getById);
router.put("/:id", walletController.update);
router.delete("/:id", walletController.delete);
router.post("/filter", walletController.filter);
router.post("/", walletController.create);
router.post("/deleteMany", walletController.deleteMany);
module.exports = router;
