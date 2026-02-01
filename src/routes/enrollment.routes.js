const express = require("express");
const router = express.Router();

// Middleware
const { authMiddleware } = require("../middleware");

// Controllers
const { enrollmentController } = require("../controllers");

// Routes
router.get("/", enrollmentController.list);
router.get('/getCoursematerialDetails',authMiddleware,enrollmentController.getCoursematerialdetails),
router.get('/getallcourseList',authMiddleware,enrollmentController.getallMycourseList)
router.get("/:id", enrollmentController.getById);
router.put("/:id", enrollmentController.update);
router.delete("/:id", enrollmentController.delete);
router.post("/filter", enrollmentController.filter);
router.post("/", enrollmentController.create);
router.post("/deleteMany", enrollmentController.deleteMany);
router.post('/startPaypalPayment',authMiddleware,enrollmentController.startPaypalPayment)
router.post('/paypalSuccess',enrollmentController.paypalSuccess)
module.exports = router;
