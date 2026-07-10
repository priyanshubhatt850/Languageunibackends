const cartService = require('../services/cart.service');

class CartController {
  async getCart(req, res, next) {
    try {
      const data = await cartService.getCart(req.user._id);
      return res.json({ success: true, cart: data });
    } catch (err) {
      next(err);
    }
  }

  async addToCart(req, res, next) {
    try {
      const { courseId } = req.body;
      if (!courseId) {
        return res.status(400).json({ success: false, message: "courseId is required" });
      }
      const data = await cartService.addToCart(req.user._id, courseId);
      return res.json({ success: true, cart: data });
    } catch (err) {
      next(err);
    }
  }

  async removeFromCart(req, res, next) {
    try {
      const { courseId } = req.body;
      if (!courseId) {
        return res.status(400).json({ success: false, message: "courseId is required" });
      }
      const data = await cartService.removeFromCart(req.user._id, courseId);
      return res.json({ success: true, cart: data });
    } catch (err) {
      next(err);
    }
  }

  async saveForLater(req, res, next) {
    try {
      const { courseId } = req.body;
      if (!courseId) {
        return res.status(400).json({ success: false, message: "courseId is required" });
      }
      const data = await cartService.saveForLater(req.user._id, courseId);
      return res.json({ success: true, cart: data });
    } catch (err) {
      next(err);
    }
  }

  async moveToCart(req, res, next) {
    try {
      const { courseId } = req.body;
      if (!courseId) {
        return res.status(400).json({ success: false, message: "courseId is required" });
      }
      const data = await cartService.moveToCart(req.user._id, courseId);
      return res.json({ success: true, cart: data });
    } catch (err) {
      next(err);
    }
  }

  async clearCart(req, res, next) {
    try {
      const data = await cartService.clearCart(req.user._id);
      return res.json({ success: true, cart: data });
    } catch (err) {
      next(err);
    }
  }

  // --- PayPal Cart Checkout ---
  async startPaypalCheckout(req, res, next) {
    try {
      const data = await cartService.startPaypalCheckout(req);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async paypalSuccess(req, res, next) {
    try {
      const data = await cartService.paypalSuccess(req);
      // Redirect back to website success page or print json response
      if (data.success) {
        const redirectRoute = req.query.redirectRoute || 'MyLearning';
        return res.redirect(`${process.env.BASE_URL_WEBSITE}/${redirectRoute}?checkoutSuccess=true`);
      }
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  // --- Razorpay Cart Checkout ---
  async startRazorpayCheckout(req, res, next) {
    try {
      const data = await cartService.startRazorpayCheckout(req);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async verifyRazorpayCheckout(req, res, next) {
    try {
      const data = await cartService.verifyRazorpayCheckout(req);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  // --- Admin Operations ---
  async getAllCarts(req, res, next) {
    try {
      const data = await cartService.getAllCarts();
      return res.json({ success: true, carts: data });
    } catch (err) {
      next(err);
    }
  }

  async sendReminder(req, res, next) {
    try {
      const { userId, courseNames } = req.body;
      if (!userId || !courseNames || !Array.isArray(courseNames)) {
        return res.status(400).json({ success: false, message: "userId and courseNames (array) are required" });
      }
      const data = await cartService.sendCartReminder(userId, courseNames);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CartController();
