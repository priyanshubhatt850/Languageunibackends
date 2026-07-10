const express = require("express");
const router = express.Router();

// Middleware
const { authMiddleware } = require("../middleware");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { env } = require("../constants");

const optionalAuth = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      if (token) {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        if (decoded && decoded._id) {
          const user = await User.findById(decoded._id).lean();
          if (user) {
            req.user = JSON.parse(JSON.stringify(user));
          }
        }
      }
    }
  } catch (err) {
    console.error("Optional auth verification failed:", err.message);
  }
  next();
};

// Controllers
const { enrollmentController } = require("../controllers");

// Routes
router.get("/", enrollmentController.list);
router.get('/getCoursematerialDetails', optionalAuth, enrollmentController.getCoursematerialdetails);
router.get('/getallcourseList', authMiddleware, enrollmentController.getallMycourseList);
router.get("/:id", enrollmentController.getById);
router.put("/:id", enrollmentController.update);
router.delete("/:id", enrollmentController.delete);
router.post("/filter", enrollmentController.filter);
router.post("/", enrollmentController.create);
router.post("/deleteMany", enrollmentController.deleteMany);
router.post('/startPaypalPayment',authMiddleware,enrollmentController.startPaypalPayment)
router.post('/paypalSuccess',enrollmentController.paypalSuccess)
module.exports = router;
