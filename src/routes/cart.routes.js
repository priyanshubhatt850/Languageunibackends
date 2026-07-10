const express = require('express');
const router = express.Router();
const { authMiddleware, adminauthMiddleware } = require('../middleware');
const cartController = require('../controllers/cartController');

// User cart routes require user authentication
router.get('/', authMiddleware, cartController.getCart);
router.post('/add', authMiddleware, cartController.addToCart);
router.post('/remove', authMiddleware, cartController.removeFromCart);
router.post('/save-for-later', authMiddleware, cartController.saveForLater);
router.post('/move-to-cart', authMiddleware, cartController.moveToCart);
router.post('/clear', authMiddleware, cartController.clearCart);

// Checkout
router.post('/checkout/paypal', authMiddleware, cartController.startPaypalCheckout);
router.get('/checkout/paypal-success', cartController.paypalSuccess);
router.post('/checkout/razorpay', authMiddleware, cartController.startRazorpayCheckout);
router.post('/checkout/razorpay-verify', authMiddleware, cartController.verifyRazorpayCheckout);

// Admin cart panel endpoints
router.get('/admin/all', adminauthMiddleware, cartController.getAllCarts);
router.post('/admin/send-reminder', adminauthMiddleware, cartController.sendReminder);

module.exports = router;
