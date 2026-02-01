const Enrollment = require("../models/Enrollment");
const courseTransactionsModel = require("../models/courseTransactionsModel");
const moment = require('moment')
const paypal = require('paypal-rest-sdk');
const axios = require("axios");

paypal.configure({
  mode: process.env.Paypal_Mode,
  client_id: process.env.Paypal_ClientId,
  client_secret: process.env.Paypal_Secret_Key,
});


class EnrollmentService {
  async list({ sort, limit, skip, fields }) {
    return Enrollment.find({})
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async filter(query, { sort, limit, skip, fields }) {
    return Enrollment.find(query)
      .select(fields || "")
      .sort(sort || {})
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .lean();
  }

  async getById(id) {
    return Enrollment.findById(id).lean();
  }

  async create(data) {
    return Enrollment.create(data);
  }

  async update(id, data) {
    return Enrollment.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    return Enrollment.findByIdAndDelete(id).lean();
  }

  async deleteMany(query) {
    return Enrollment.deleteMany(query);
  }
  async startPaypalPayment(req = {}) {
    try {
      const { amount, redirectRoute, levelId, userCountry, ip,instructor_id } = req.body;
      let todaysDate = moment().format("YYYY-MM-DD");
      const token = await generateAccessToken();
      let paymentDetails = {
        user_id: req.user._id,
        amount: amount,
        levelId: levelId,
        status: "pending",
        payment_type: "Paypal",
        country: userCountry||'',
        userIp: ip||''
      };
      
      
      const courseTransactions = await courseTransactionsModel.create(paymentDetails);
      let coursepaymentDetails = {
        user_id:req.user._id,
        instructor_id:instructor_id,
        course_id:levelId,
        payment_amount:amount,
        payment_status:'pending',
        status:'active',
        enrolled_date:todaysDate,
        start_date:todaysDate,
        courseTransactionId:courseTransactions._id
      }
   
      const enrollment = await Enrollment.create(coursepaymentDetails)

      let custom = {
        user_id: req.user._id,
        levelId: levelId,
        transaction_id: courseTransactions._id,
        payment_type: "Paypal",
      };
         // country: userCountry,
    

   
         const payload = {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: amount,
            },
            description: `${JSON.stringify(custom)}`,
          },
        ],
        application_context: {
          shipping_preference: 'NO_SHIPPING',
          return_url: `${process.env.BASE_URL}/enrollment/paypalSuccess?transactionId=${courseTransactions._id}&userId=${req.user._id}&redirectRoute=${redirectRoute}`,
          cancel_url: `${process.env.BASE_URL_WEBSITE}/${redirectRoute}`,
        },
      };
      const response = await axios.post(
        `${process.env.Paypal_Api_Url}/v2/checkout/orders`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('=======================> Payment initialized. ', response.data)
      if (!response?.data?.links) {
        logger.error({ message: "Payment not initialized." });
        return false;
      }

      let check = response.data.links.find(ele => ele.rel == 'approve')

      if (!check) {
        logger.error({ message: `Missing Approve Link check ${JSON.stringify(custom)} ${response?.data} ` });
      }

      let link = response.data.links.find(ele => ele.rel == 'approve') || response.data.links.find(ele => ele.rel == 'capture')
      if (!link) {
        logger.error({ message: "Failed to initialize Paypal. Capture also missing" });
        return false;
      }
      return { success: true, link: link.href, paypal: response.data};

    } catch (error) {
      console.log(error)
    }
  }
  async paypalSuccess(req = {}) {

  }
}

const generateAccessToken = async () => {
  try {
    if (!process.env.Paypal_ClientId || !process.env.Paypal_Secret_Key) {
      logger.error({ message: "Missing Paypal Credentials." });
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
    if (!response?.data?.access_token) {
      logger.error({ message: "Token not generated." });
      return false;
    }
    return response.data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error.message);
    return false;
  }
};
module.exports = new EnrollmentService();
