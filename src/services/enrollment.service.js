const Enrollment = require("../models/Enrollment");
const CourseLevel = require('../models/CourseLevel')
const StudyMaterial = require('../models/StudyMaterial')
const courseTransactionsModel = require("../models/courseTransactionsModel");
const moment = require('moment')
const paypal = require('paypal-rest-sdk');
const axios = require("axios");
const mongoose = require("mongoose");
const crypto = require("crypto");
const ALGORITHM = "aes-256-cbc";
const KEY = Buffer.from(process.env.MATERIAL_ENCRYPTION_KEY, "utf8"); // 32 bytes
const IV_LENGTH = 16;

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
      const { amount, redirectRoute, levelId, userCountry, ip, instructor_id } = req.body;
      let todaysDate = moment().format("YYYY-MM-DD");
      const token = await generateAccessToken();
      let paymentDetails = {
        user_id: req.user._id,
        amount: amount,
        levelId: levelId,
        status: "pending",
        payment_type: "Paypal",
        country: userCountry || '',
        userIp: ip || ''
      };


      const courseTransactions = await courseTransactionsModel.create(paymentDetails);
      let coursepaymentDetails = {
        user_id: req.user._id,
        instructor_id: instructor_id,
        course_id: levelId,
        payment_amount: amount,
        payment_status: 'pending',
        status: 'active',
        enrolled_date: todaysDate,
        start_date: todaysDate,
        courseTransactionId: courseTransactions._id
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
      return { success: true, link: link.href, paypal: response.data };

    } catch (error) {
      console.log(error)
    }
  }

  async getcoursematerialDetails(req = {}) {
    try {
      const { levelId } = req.query;
      const userId = req.user ? req.user._id : null;

      if (!mongoose.Types.ObjectId.isValid(levelId)) {
        return { success: false, message: "Invalid level id" };
      }

      // Indexes required:
      // CourseLevel: { _id: 1, status: 1 }
      // Enrollment: { course_id: 1, user_id: 1, payment_status: 1 }
      // StudyMaterial: { level_id: 1, display_order: 1 }

      const [result] = await CourseLevel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(levelId),
            status: "published"
          }
        },

        // Language
        {
          $lookup: {
            from: "languages",
            localField: "language_id",
            foreignField: "_id",
            as: "language"
          }
        },

        // Enrollment check (FAST with index)
        {
          $lookup: {
            from: "enrollments",
            let: {
              levelId: "$_id",
              userId: userId ? new mongoose.Types.ObjectId(userId) : null
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$course_id", "$$levelId"] },
                      { $eq: ["$user_id", "$$userId"] },
                      { $eq: ["$payment_status", "completed"] }
                    ]
                  }
                }
              },
              { $limit: 1 }
            ],
            as: "enrollment"
          }
        },

        // Shape response
        {
          $addFields: {
            language: { $arrayElemAt: ["$language", 0] },
            enrollment: { $arrayElemAt: ["$enrollment", 0] },
            hasAccess: {
              $gt: [{ $size: "$enrollment" }, 0]
            }
          }
        },

        {
          $project: {
            __v: 0
          }
        }
      ]);

      if (!result) {
        return { success: false, message: "Level not found" };
      }

      let encryptedMaterials = [];

      // StudyMaterial: { level_id: 1, display_order: 1 }
      const rawMaterials = await StudyMaterial
        .find({ level_id: levelId })
        .sort({ display_order: 1 })
        .lean();

      if (rawMaterials.length) {
        encryptedMaterials = encrypt(rawMaterials);
      }

      // Do not remove materials, just return as before
      return ({
        success: true,
        level: result,
        language: result.language,
        materials: encryptedMaterials,   // 🔐 encrypted only
        enrollment: result.enrollment || null,
        hasAccess: result.hasAccess
      });

    } catch (error) {
      console.error("getcoursematerialDetails error:", error);
      return {
        success: false,
        message: "Server error"
      };
    }
  }

  async getallmycourseList(req = {}) {
    const userId = req.user._id;
    // Indexes required:
    // Enrollment: { user_id: 1, payment_status: 1, course_id: 1 }
    // CourseLevel: { _id: 1, language_id: 1 }
    // StudyMaterial: { level_id: 1 }
    // Language: { _id: 1 }
    const pipeLine = [
      {
        $match: {
          user_id: new mongoose.Types.ObjectId(userId),
          payment_status: "completed"
        }
      },
      {
        $lookup: {
          from: "courselevels",
          localField: "course_id",
          foreignField: "_id",
          as: "courseDetails"
        }
      },
      { $unwind: "$courseDetails" },

      {
        $lookup: {
          from: "languages",
          localField: "courseDetails.language_id",
          foreignField: "_id",
          as: "languageDetails"
        }
      },
      { $unwind: "$languageDetails" },

      // 🔥 MATERIAL COUNT ONLY
      {
        $lookup: {
          from: "studymaterials",
          let: { courseId: "$course_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$level_id", "$$courseId"] }
              }
            },
            { $count: "count" }
          ],
          as: "materialCount"
        }
      },

      // 🔥 Extract number safely
      {
        $addFields: {
          totalMaterials: {
            $ifNull: [{ $arrayElemAt: ["$materialCount.count", 0] }, 0]
          }
        }
      },

      // ❌ Remove temp field
      {
        $project: {
          materialCount: 0,
          __v: 0,
          "courseDetails.__v": 0,
          "languageDetails.__v": 0
        }
      }
    ];


    const data = await Enrollment.aggregate(pipeLine);
    return data;
  }

  async paypalSuccess(req = {}) {

  }
}

// Ensure indexes for performance (auto-create if missing)
// async function ensureIndexes() {
//   try {
//     await Enrollment.collection.createIndex({ user_id: 1, payment_status: 1, course_id: 1 });
//     await CourseLevel.collection.createIndex({ _id: 1, status: 1 });
//     await StudyMaterial.collection.createIndex({ level_id: 1, display_order: 1 });
//     // Optionally, add more indexes if needed for other lookups
//   } catch (err) {
//     console.error("Index creation error:", err);
//   }
// }
// ensureIndexes();

const encrypt = (data) => {
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(JSON.stringify(data), "utf8", "hex");
  encrypted += cipher.final("hex");

  return {
    iv: iv.toString("hex"),
    content: encrypted
  };
};


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
