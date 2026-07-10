const express = require("express");
const router = express.Router();

// Middleware
const { authMiddleware } = require("../middleware");

// Controller
const razorpayController = require("../controllers/razorpayController");

/**
 * Razorpay Payment Routes
 * 
 * Flow:
 * 1. Client calls POST /razorpay/create-order to create an order
 * 2. Client receives orderId and uses Razorpay SDK to collect payment
 * 3. After payment, client calls POST /razorpay/verify-payment with payment details
 * 4. Server also receives webhook events at POST /razorpay/webhook for verification
 */

// Create order (requires authentication)
router.post("/create-order", authMiddleware, razorpayController.createOrder);

// Verify payment (requires authentication)
router.post("/verify-payment", authMiddleware, razorpayController.verifyPayment);

// Get payment details (requires authentication)
router.get("/payment/:paymentId", authMiddleware, razorpayController.getPaymentDetails);

// Get order details (requires authentication)
router.get("/order/:orderId", authMiddleware, razorpayController.getOrderDetails);

// Webhook endpoint (NO authentication - called by Razorpay servers)
// Configure this URL in your Razorpay dashboard
// URL: https://yourdomain.com/razorpay/webhook
// Events to subscribe: payment.authorized, payment.captured, payment.failed, order.paid
router.post("/webhook", razorpayController.webhook);

// Capture payment endpoint (manual capture if needed)
router.post("/capture-payment", authMiddleware, razorpayController.capturePayment);

module.exports = router;
