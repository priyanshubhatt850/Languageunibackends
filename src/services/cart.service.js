const Cart = require('../models/Cart');
const CourseLevel = require('../models/CourseLevel');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const courseTransactionsModel = require('../models/courseTransactionsModel');
const mongoose = require('mongoose');
const moment = require('moment');
const axios = require('axios');
const crypto = require('crypto');
const { logger } = require('../config/logger');

// Initialize Razorpay instance safely
let razorpayInstance = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  try {
    const Razorpay = require('razorpay');
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  } catch (err) {
    console.error("Razorpay initialization error:", err);
  }
}

// PayPal token generation helper
const generateAccessToken = async () => {
  try {
    if (!process.env.Paypal_ClientId || !process.env.Paypal_Secret_Key) {
      return false;
    }
    const auth = Buffer.from(
      process.env.Paypal_ClientId + ":" + process.env.Paypal_Secret_Key
    ).toString("base64");
    const response = await axios.post(
      `${process.env.Paypal_Api_Url}/v1/oauth2/token`,
      "grant_type=client_credentials",
      { headers: { Authorization: `Basic ${auth}` } }
    );
    return response?.data?.access_token || false;
  } catch (error) {
    console.error("Failed to generate Access Token:", error.message);
    return false;
  }
};

class CartService {
  async getCart(userId) {
    let cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
      cart = await Cart.create({ user_id: userId, items: [], wishlist: [] });
    }

    // Populate items and wishlist recursively
    const populated = await Cart.findById(cart._id)
      .populate({
        path: 'items',
        populate: [
          { path: 'language_id' },
          { 
            path: 'instructor_id',
            select: 'full_name email avatar_url'
          }
        ]
      })
      .populate({
        path: 'wishlist',
        populate: [
          { path: 'language_id' },
          { 
            path: 'instructor_id',
            select: 'full_name email avatar_url'
          }
        ]
      })
      .lean();

    return populated;
  }

  async addToCart(userId, courseId) {
    let cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
      cart = await Cart.create({ user_id: userId, items: [], wishlist: [] });
    }

    const courseObjId = new mongoose.Types.ObjectId(courseId);

    // Duplicate check
    if (!cart.items.some(id => id.toString() === courseId)) {
      cart.items.push(courseObjId);
    }
    // Remove from wishlist if it exists there
    cart.wishlist = cart.wishlist.filter(id => id.toString() !== courseId);
    await cart.save();

    return this.getCart(userId);
  }

  async removeFromCart(userId, courseId) {
    const cart = await Cart.findOne({ user_id: userId });
    if (cart) {
      cart.items = cart.items.filter(id => id.toString() !== courseId);
      await cart.save();
    }
    return this.getCart(userId);
  }

  async saveForLater(userId, courseId) {
    const cart = await Cart.findOne({ user_id: userId });
    if (cart) {
      const courseObjId = new mongoose.Types.ObjectId(courseId);
      cart.items = cart.items.filter(id => id.toString() !== courseId);
      if (!cart.wishlist.some(id => id.toString() === courseId)) {
        cart.wishlist.push(courseObjId);
      }
      await cart.save();
    }
    return this.getCart(userId);
  }

  async moveToCart(userId, courseId) {
    const cart = await Cart.findOne({ user_id: userId });
    if (cart) {
      const courseObjId = new mongoose.Types.ObjectId(courseId);
      cart.wishlist = cart.wishlist.filter(id => id.toString() !== courseId);
      if (!cart.items.some(id => id.toString() === courseId)) {
        cart.items.push(courseObjId);
      }
      await cart.save();
    }
    return this.getCart(userId);
  }

  async clearCart(userId) {
    const cart = await Cart.findOne({ user_id: userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    return this.getCart(userId);
  }

  // --- PayPal Cart Checkout ---
  async startPaypalCheckout(req) {
    try {
      const userId = req.user._id;
      const { redirectRoute, userCountry, ip } = req.body;

      const cart = await Cart.findOne({ user_id: userId }).populate('items');
      if (!cart || cart.items.length === 0) {
        return { success: false, message: "Cart is empty" };
      }

      // Calculate total amount
      const totalAmount = cart.items.reduce((sum, item) => sum + (item.discount_price || item.price || 0), 0);
      const todaysDate = moment().format("YYYY-MM-DD");
      const token = await generateAccessToken();

      // Create transaction record
      const paymentDetails = {
        user_id: userId,
        amount: totalAmount,
        levelId: cart.items[0]._id, // Use first item as a fallback reference
        status: "pending",
        payment_type: "Paypal_Cart",
        country: userCountry || '',
        userIp: ip || ''
      };
      const courseTransaction = await courseTransactionsModel.create(paymentDetails);

      // Create a pending enrollment record for each course in the cart
      const enrollmentIds = [];
      for (const item of cart.items) {
        const enrollment = await Enrollment.create({
          user_id: userId,
          instructor_id: item.instructor_id,
          course_id: item._id,
          payment_amount: item.discount_price || item.price,
          payment_status: 'pending',
          status: 'active',
          enrolled_date: todaysDate,
          start_date: todaysDate,
          courseTransactionId: courseTransaction._id
        });
        enrollmentIds.push(enrollment._id.toString());
      }

      const customMetadata = {
        user_id: userId.toString(),
        transaction_id: courseTransaction._id.toString(),
        enrollment_ids: enrollmentIds,
        payment_type: "Paypal_Cart"
      };

      const payload = {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: totalAmount,
            },
            description: `${JSON.stringify(customMetadata)}`,
          },
        ],
        application_context: {
          shipping_preference: 'NO_SHIPPING',
          return_url: `${process.env.BASE_URL}/cart/checkout/paypal-success?transactionId=${courseTransaction._id}&userId=${userId}&redirectRoute=${redirectRoute}`,
          cancel_url: `${process.env.BASE_URL_WEBSITE}/${redirectRoute}`,
        },
      };

      const response = await axios.post(
        `${process.env.Paypal_Api_Url}/v2/checkout/orders`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const approveLink = response.data.links.find(ele => ele.rel === 'approve') || response.data.links.find(ele => ele.rel === 'capture');
      if (!approveLink) {
        return { success: false, message: "Approve link missing from PayPal response" };
      }

      return { success: true, link: approveLink.href, paypal: response.data };
    } catch (error) {
      console.error("PayPal checkout setup failed:", error);
      return { success: false, message: error.message };
    }
  }

  async paypalSuccess(req) {
    try {
      const { transactionId, token } = req.query;

      // Update Transaction status
      const transaction = await courseTransactionsModel.findByIdAndUpdate(
        transactionId,
        { status: 'completed' },
        { new: true }
      );

      if (!transaction) {
        return { success: false, message: "Transaction not found" };
      }

      // Update all enrollments linked to this transaction
      await Enrollment.updateMany(
        { courseTransactionId: transactionId },
        { payment_status: 'completed' }
      );

      // Clear the user's cart items
      await Cart.findOneAndUpdate(
        { user_id: transaction.user_id },
        { items: [] }
      );

      return { success: true, message: "Checkout completed successfully" };
    } catch (error) {
      console.error("PayPal checkout success processing failed:", error);
      return { success: false, message: error.message };
    }
  }

  // --- Razorpay Cart Checkout ---
  async startRazorpayCheckout(req) {
    try {
      const userId = req.user._id;
      const { userCountry, ip } = req.body;

      const cart = await Cart.findOne({ user_id: userId }).populate('items');
      if (!cart || cart.items.length === 0) {
        return { success: false, message: "Cart is empty" };
      }

      const totalAmount = cart.items.reduce((sum, item) => sum + (item.discount_price || item.price || 0), 0);
      const todaysDate = moment().format("YYYY-MM-DD");

      // Create transaction record
      const paymentDetails = {
        user_id: userId,
        amount: totalAmount,
        levelId: cart.items[0]._id,
        status: "pending",
        payment_type: "Razorpay_Cart",
        country: userCountry || '',
        userIp: ip || ''
      };
      const courseTransaction = await courseTransactionsModel.create(paymentDetails);

      // Create pending enrollments
      const enrollmentIds = [];
      for (const item of cart.items) {
        const enrollment = await Enrollment.create({
          user_id: userId,
          instructor_id: item.instructor_id,
          course_id: item._id,
          payment_amount: item.discount_price || item.price,
          payment_status: 'pending',
          status: 'active',
          enrolled_date: todaysDate,
          start_date: todaysDate,
          courseTransactionId: courseTransaction._id
        });
        enrollmentIds.push(enrollment._id.toString());
      }

      const customMetadata = {
        user_id: userId.toString(),
        transaction_id: courseTransaction._id.toString(),
        enrollment_ids: enrollmentIds,
        payment_type: "Razorpay_Cart"
      };

      if (!razorpayInstance) {
        return { success: false, message: "Razorpay credentials not configured" };
      }

      // Create Razorpay order options
      const orderOptions = {
        amount: Math.round(totalAmount * 100), // INR in paise
        currency: "INR",
        receipt: `cart_receipt_${courseTransaction._id}`,
        notes: customMetadata,
        payment_capture: 1
      };

      const order = await razorpayInstance.orders.create(orderOptions);

      return {
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        transactionId: courseTransaction._id.toString(),
      };
    } catch (error) {
      console.error("Razorpay checkout setup failed:", error);
      return { success: false, message: error.message };
    }
  }

  async verifyRazorpayCheckout(req) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, transactionId } = req.body;

      // Verify Razorpay signature
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');

      const isValid = expectedSignature === razorpay_signature;
      if (!isValid) {
        return { success: false, message: "Payment verification failed: Invalid Signature" };
      }

      // Update Transaction status
      const updatedTransaction = await courseTransactionsModel.findByIdAndUpdate(
        transactionId,
        {
          status: "completed",
          transaction_id: razorpay_payment_id,
          payment_method: "Razorpay"
        },
        { new: true }
      );

      if (!updatedTransaction) {
        return { success: false, message: "Transaction record not found" };
      }

      // Update all enrollments linked to this transaction
      await Enrollment.updateMany(
        { courseTransactionId: transactionId },
        { payment_status: "completed" }
      );

      // Clear the user's cart items
      await Cart.findOneAndUpdate(
        { user_id: updatedTransaction.user_id },
        { items: [] }
      );

      return {
        success: true,
        message: "Payment completed successfully",
        transactionId,
        paymentId: razorpay_payment_id
      };
    } catch (error) {
      console.error("Razorpay verification failed:", error);
      return { success: false, message: error.message };
    }
  }

  // --- Admin Panel Operations ---
  async getAllCarts() {
    return await Cart.find({ "items.0": { $exists: true } })
      .populate('user_id', 'full_name email role avatar_url')
      .populate({
        path: 'items',
        populate: { path: 'language_id' }
      })
      .lean();
  }

  async sendCartReminder(userId, courseNames) {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const emailHtml = `
      <div style="font-family: sans-serif; padding: 24px; color: #1e293b; max-width: 600px; margin: auto; border: 1px solid #f1f5f9; border-radius: 16px;">
        <h2 style="font-weight: 800; color: #7c3aed; margin-bottom: 16px;">Don't leave your goals behind! 📚</h2>
        <p>Hi <strong>${user.full_name || 'Student'}</strong>,</p>
        <p>We noticed you left some amazing language courses in your Global Tongue learning cart:</p>
        <ul style="padding-left: 20px; font-weight: 700; color: #4c1d95;">
          ${courseNames.map(name => `<li>${name}</li>`).join('')}
        </ul>
        <p>Complete your checkout today to unlock lifetime access, instructor feedback, and your certificate of completion!</p>
        <div style="margin: 24px 0;">
          <a href="${process.env.BASE_URL_WEBSITE || 'http://localhost:5000'}/Cart" style="background-color: #7c3aed; color: #ffffff; padding: 12px 24px; border-radius: 12px; font-weight: bold; text-decoration: none; display: inline-block;">Go to Shopping Cart</a>
        </div>
        <hr style="border: 0; border-top: 1px solid #f1f5f9;" />
        <p style="font-size: 12px; color: #94a3b8;">You received this because items were added to your learning cart on Global Tongue. Happy learning!</p>
      </div>
    `;

    const emailService = require('./email.service');
    await emailService.sendMail({
      to: user.email,
      subject: "Unlock Your Language Goals - Items in Cart 🛒",
      html: emailHtml
    });

    return { success: true, message: "Reminder email sent successfully!" };
  }
}

module.exports = new CartService();
