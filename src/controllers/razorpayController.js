const razorpayService = require("../services/razorpay.service");
const { logger } = require("../config/logger");

class RazorpayController {
  /**
   * Create Razorpay order
   * POST /razorpay/create-order
   */
  async createOrder(req, res, next) {
    try {
      const data = await razorpayService.createOrder(req);
      return res.json(data);
    } catch (error) {
        console.log(error,"this is error >>")
    //   logger.error({ message: "Error in createOrder", error: error.message });
      next(error);
    }
  }

  /**
   * Verify payment and handle successful payment
   * POST /razorpay/verify-payment
   * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, transactionId, enrollmentId }
   */
  async verifyPayment(req, res, next) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, transactionId } = req.body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !transactionId) {
        return res.status(400).json({
          success: false,
          message: "Missing required payment verification data"
        });
      }

      const paymentData = {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        transactionId
      };

      const result = await razorpayService.handlePaymentSuccess(paymentData);
      return res.json(result);

    } catch (error) {
      logger.error({ message: "Error in verifyPayment", error: error.message });
      next(error);
    }
  }

  /**
   * Get payment details
   * GET /razorpay/payment/:paymentId
   */
  async getPaymentDetails(req, res, next) {
    try {
      const { paymentId } = req.params;
      const result = await razorpayService.getPaymentDetails(paymentId);
      return res.json(result);
    } catch (error) {
      logger.error({ message: "Error in getPaymentDetails", error: error.message });
      next(error);
    }
  }

  /**
   * Get order details
   * GET /razorpay/order/:orderId
   */
  async getOrderDetails(req, res, next) {
    try {
      const { orderId } = req.params;
      const result = await razorpayService.getOrderDetails(orderId);
      return res.json(result);
    } catch (error) {
      logger.error({ message: "Error in getOrderDetails", error: error.message });
      next(error);
    }
  }

  /**
   * Webhook handler for Razorpay payment events
   * POST /razorpay/webhook
   * Header: X-Razorpay-Signature
   * 
   * Webhook events handled:
   * - payment.authorized: Payment is authorized
   * - payment.failed: Payment failed
   * - payment.captured: Payment successfully captured (main success event)
   * - order.paid: Order marked as paid
   */
  async webhook(req, res, next) {
    try {
      const webhookData = req.body;
      const webhookSignature = req.headers['x-razorpay-signature'];

      if (!webhookSignature) {
        logger.error({ message: "Missing webhook signature header" });
        return res.status(400).json({ success: false, message: "Missing signature" });
      }

      logger.info({
        message: "Razorpay webhook received",
        event: webhookData.event
      });

      const result = await razorpayService.handleWebhook(webhookData, webhookSignature);

      // Always return 200 to acknowledge receipt
      return res.status(200).json({
        success: true,
        message: "Webhook processed"
      });

    } catch (error) {
      logger.error({ message: "Error in webhook handler", error: error.message });
      // Still return 200 to acknowledge
      return res.status(200).json({
        success: true,
        message: "Webhook acknowledged"
      });
    }
  }

  /**
   * Capture a payment (if using manual capture mode)
   * POST /razorpay/capture-payment
   */
  async capturePayment(req, res, next) {
    try {
      const { paymentId, amount } = req.body;

      if (!paymentId || !amount) {
        return res.status(400).json({
          success: false,
          message: "Missing paymentId or amount"
        });
      }

      // Note: This would be used if you set payment_capture: 0 in order creation
      logger.info({
        message: "Capture payment requested",
        paymentId,
        amount
      });

      return res.json({
        success: true,
        message: "Payment capture initiated"
      });

    } catch (error) {
      logger.error({ message: "Error in capturePayment", error: error.message });
      next(error);
    }
  }
}

module.exports = new RazorpayController();
