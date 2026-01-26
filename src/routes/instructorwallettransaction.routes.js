const express = require("express");
const router = express.Router();

// Middleware
// const { authMiddleware } = require("../middleware");

// Controllers
const { instructorwallettransactionController } = require("../controllers");

// Routes
router.get("/", instructorwallettransactionController.list);
router.get("/:id", instructorwallettransactionController.getById);
router.put("/:id", instructorwallettransactionController.update);
router.delete("/:id", instructorwallettransactionController.delete);
router.post("/filter", instructorwallettransactionController.filter);
router.post("/", instructorwallettransactionController.create);
router.post("/deleteMany", instructorwallettransactionController.deleteMany);
module.exports = router;
