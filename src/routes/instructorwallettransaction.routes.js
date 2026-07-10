const express = require("express");
const router = express.Router();

// Middleware
const { authMiddleware } = require("../middleware");

// Controllers
const { instructorwallettransactionController } = require("../controllers");

// Routes
router.get("/", instructorwallettransactionController.list);
router.get("/:id", instructorwallettransactionController.getById);
router.put("/:id", authMiddleware, instructorwallettransactionController.update);
router.delete("/:id", authMiddleware, instructorwallettransactionController.delete);
router.post("/filter", instructorwallettransactionController.filter);
router.post("/", authMiddleware, instructorwallettransactionController.create);
router.post("/deleteMany", authMiddleware, instructorwallettransactionController.deleteMany);
module.exports = router;
