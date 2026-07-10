const Razorpay = require('razorpay');
const crypto = require('crypto');
const axios = require('axios');
const courseTransactionsModel = require("../models/courseTransactionsModel");
const Enrollment = require("../models/Enrollment");
const moment = require('moment');
const { logger } = require('../config/logger');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

class RazorpayService {
  /**
   * Create Razorpay order for course enrollment payment
   * @param {Object} req - Request object with body containing amount, levelId, redirectRoute, instructor_id
   * @returns {Object} - { success: true, orderId, amount, currency }
   */
  async createOrder(req = {}) {
    try {
      const { amount, levelId, redirectRoute, instructor_id, userCountry, ip } = req.body;
      const userId = req.user._id;

      if (!amount || !levelId) {
        logger.error({ message: "Missing amount or levelId for Razorpay order" });
        return { success: false, message: "Invalid payment parameters" };
      }

      const todaysDate = moment().format("YYYY-MM-DD");

      // Create payment transaction record
      const paymentDetails = {
        user_id: userId,
        amount: amount,
        levelId: levelId,
        status: "pending",
        payment_type: "Razorpay",
        country: userCountry || '',
        userIp: ip || ''
      };

      const courseTransaction = await courseTransactionsModel.create(paymentDetails);

      // Create enrollment record
      const coursepaymentDetails = {
        user_id: userId,
        instructor_id: instructor_id,
        course_id: levelId,
        payment_amount: amount,
        payment_status: 'pending',
        status: 'active',
        enrolled_date: todaysDate,
        start_date: todaysDate,
        courseTransactionId: courseTransaction._id
      };

      const enrollment = await Enrollment.create(coursepaymentDetails);

      // Create custom metadata for order
      const customData = {
        user_id: userId.toString(),
        levelId: levelId.toString(),
        transaction_id: courseTransaction._id.toString(),
        payment_type: "Razorpay",
        enrollment_id: enrollment._id.toString(),
        redirectRoute
      };

      // Create Razorpay order
      const orderOptions = {
        amount: Math.round(amount * 100), // Razorpay expects amount in paise
        currency: "INR",
        receipt: `receipt_${courseTransaction._id}`,
        notes: customData,
        payment_capture: 1 // Auto capture payment
      };

      const order = await razorpay.orders.create(orderOptions);

    //   console.log(order, "this is order >>");
      //   logger.info({
      // //     message: "Razorpay order created",
      // //     orderId: order.id,
      // //     amount: order.amount,
      // //     transactionId: courseTransaction._id
    //   //   });

      return {
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        transactionId: courseTransaction._id.toString(),
        enrollmentId: enrollment._id.toString()
      };

    } catch (error) {
        console.log(error,"this is error >>")
    //   logger.error({ message: "Error creating Razorpay order", error: error.message });
      return { success: false, message: error.message };
    }
  }

  /**
   * Verify Razorpay payment signature
   * @param {Object} paymentData - Payment data with razorpay_order_id, razorpay_payment_id, razorpay_signature
   * @returns {Object} - { valid: true/false }
   */
  verifyPaymentSignature(paymentData) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;

      // Create the signature hash
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');

      const isValid = expectedSignature === razorpay_signature;

      if (!isValid) {
        logger.error({ message: "Invalid Razorpay signature", razorpay_order_id });
      }

      return isValid;
    } catch (error) {
      logger.error({ message: "Error verifying signature", error: error.message });
      return false;
    }
  }

  /**
   * Handle successful payment - similar to PayPal webhook callback
   * @param {Object} paymentData - Payment verification data
   * @returns {Object} - { success: true, message }
   */
  async handlePaymentSuccess(paymentData) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, transactionId } = paymentData;

      // Verify signature first
      if (!this.verifyPaymentSignature(paymentData)) {
        logger.error({ message: "Payment verification failed", razorpay_order_id });
        return { success: false, message: "Payment verification failed" };
      }

      // Get payment details from Razorpay
      const payment = await razorpay.payments.fetch(razorpay_payment_id);

      if (payment.status !== 'captured') {
        logger.error({ message: "Payment not captured", paymentId: razorpay_payment_id });
        return { success: false, message: "Payment not captured" };
      }

      // Update transaction status
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
        logger.error({ message: "Transaction not found", transactionId });
        return { success: false, message: "Transaction not found" };
      }

      // Update enrollment status
      const updatedEnrollment = await Enrollment.findByIdAndUpdate(
        updatedTransaction.courseTransactionId || updatedTransaction._id,
        { payment_status: "completed" },
        { new: true }
      );

      logger.info({
        message: "Payment completed successfully",
        transactionId,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id
      });

      return {
        success: true,
        message: "Payment completed successfully",
        transactionId,
        paymentId: razorpay_payment_id
      };

    } catch (error) {
      logger.error({ message: "Error handling payment success", error: error.message });
      return { success: false, message: error.message };
    }
  }

  /**
   * Handle webhook events from Razorpay
   * @param {Object} webhookData - Webhook payload from Razorpay
   * @param {String} webhookSignature - Webhook signature header
   * @returns {Object} - { success: true, message }
   */
  async handleWebhook(webhookData, webhookSignature) {
    try {
      // Verify webhook signature
      const body = JSON.stringify(webhookData);
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
        .update(body)
        .digest('hex');

      if (expectedSignature !== webhookSignature) {
        logger.error({ message: "Invalid webhook signature" });
        return { success: false, message: "Invalid signature" };
      }

      const event = webhookData.event;
      const data = webhookData.payload?.payment?.entity || webhookData.payload?.order?.entity;

      logger.info({ message: `Processing Razorpay webhook event: ${event}` });

      switch (event) {
        case 'payment.authorized':
          return await this.handlePaymentAuthorized(data);

        case 'payment.failed':
          return await this.handlePaymentFailed(data);

        case 'payment.captured':
          return await this.handlePaymentCaptured(data);

        case 'order.paid':
          return await this.handleOrderPaid(data);

        default:
          logger.info({ message: `Unhandled webhook event: ${event}` });
          return { success: true, message: "Event received" };
      }

    } catch (error) {
      logger.error({ message: "Error processing webhook", error: error.message });
      return { success: false, message: error.message };
    }
  }

  /**
   * Handle payment.authorized webhook event
   */
  async handlePaymentAuthorized(paymentData) {
    try {
      const { id: paymentId, order_id: orderId, notes } = paymentData;

      logger.info({
        message: "Payment authorized",
        paymentId,
        orderId
      });

      // Payment is authorized but not yet captured
      return { success: true, message: "Payment authorized" };

    } catch (error) {
      logger.error({ message: "Error handling payment.authorized", error: error.message });
      return { success: false, message: error.message };
    }
  }

  /**
   * Handle payment.captured webhook event - Main success event
   */
  async handlePaymentCaptured(paymentData) {
    try {
      const { id: paymentId, order_id: orderId, amount, notes } = paymentData;

      // Extract custom data from notes
      const { transaction_id: transactionId, user_id: userId, levelId } = notes;

      logger.info({
        message: "Payment captured",
        paymentId,
        orderId,
        amount,
        transactionId
      });

      // Update transaction
      const updatedTransaction = await courseTransactionsModel.findByIdAndUpdate(
        transactionId,
        {
          status: "completed",
          transaction_id: paymentId,
          payment_method: "Razorpay"
        },
        { new: true }
      );

      if (!updatedTransaction) {
        logger.error({ message: "Transaction not found", transactionId });
        return { success: false, message: "Transaction not found" };
      }

      // Update enrollment - find by courseTransactionId
      await Enrollment.updateOne(
        { courseTransactionId: transactionId },
        { payment_status: "completed" }
      );

      logger.info({ message: "Transaction and enrollment updated successfully" });

      return {
        success: true,
        message: "Payment captured and verified",
        transactionId,
        paymentId
      };

    } catch (error) {
      logger.error({ message: "Error handling payment.captured", error: error.message });
      return { success: false, message: error.message };
    }
  }

  /**
   * Handle payment.failed webhook event
   */
  async handlePaymentFailed(paymentData) {
    try {
      const { id: paymentId, order_id: orderId, notes, error_description } = paymentData;
      const { transaction_id: transactionId } = notes;

      logger.error({
        message: "Payment failed",
        paymentId,
        orderId,
        error: error_description,
        transactionId
      });

      // Update transaction status to failed
      await courseTransactionsModel.findByIdAndUpdate(
        transactionId,
        { status: "failed" },
        { new: true }
      );

      logger.info({ message: "Transaction marked as failed" });

      return {
        success: true,
        message: "Payment failure recorded",
        paymentId
      };

    } catch (error) {
      logger.error({ message: "Error handling payment.failed", error: error.message });
      return { success: false, message: error.message };
    }
  }

  /**
   * Handle order.paid webhook event
   */
  async handleOrderPaid(orderData) {
    try {
      const { id: orderId, notes } = orderData;

      logger.info({
        message: "Order marked as paid",
        orderId
      });

      return {
        success: true,
        message: "Order paid successfully",
        orderId
      };

    } catch (error) {
      logger.error({ message: "Error handling order.paid", error: error.message });
      return { success: false, message: error.message };
    }
  }

  /**
   * Fetch payment details from Razorpay
   */
  async getPaymentDetails(paymentId) {
    try {
      const payment = await razorpay.payments.fetch(paymentId);
      return { success: true, payment };
    } catch (error) {
      logger.error({ message: "Error fetching payment details", error: error.message });
      return { success: false, message: error.message };
    }
  }

  /**
   * Fetch order details from Razorpay
   */
  async getOrderDetails(orderId) {
    try {
      const order = await razorpay.orders.fetch(orderId);
      return { success: true, order };
    } catch (error) {
      logger.error({ message: "Error fetching order details", error: error.message });
      return { success: false, message: error.message };
    }
  }
}

module.exports = new RazorpayService();
