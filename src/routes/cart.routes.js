const express = require('express');
const router = express.Router();
const { authMiddleware, adminauthMiddleware } = require('../middleware');
const cartController = require('../controllers/cartController');
const { validate } = require('../middleware/validate');
const cartSchemas = require('../validators/cart.validator');

// User cart routes require user authentication
router.get('/', authMiddleware, cartController.getCart);
router.post('/add', authMiddleware, validate(cartSchemas.addToCart), cartController.addToCart);
router.post('/remove', authMiddleware, validate(cartSchemas.removeFromCart), cartController.removeFromCart);
router.post('/save-for-later', authMiddleware, validate(cartSchemas.removeFromCart), cartController.saveForLater);
router.post('/move-to-cart', authMiddleware, validate(cartSchemas.addToCart), cartController.moveToCart);
router.post('/clear', authMiddleware, cartController.clearCart);

// Checkout
router.post('/checkout/paypal', authMiddleware, cartController.startPaypalCheckout);
router.get('/checkout/paypal-success', cartController.paypalSuccess);
router.post('/checkout/razorpay', authMiddleware, cartController.startRazorpayCheckout);
router.post('/checkout/razorpay-verify', authMiddleware, cartController.verifyRazorpayCheckout);

// Admin cart panel endpoints
router.get('/admin/all', adminauthMiddleware, cartController.getAllCarts);
router.post('/admin/send-reminder', adminauthMiddleware, validate(cartSchemas.sendReminder), cartController.sendReminder);

module.exports = router;
