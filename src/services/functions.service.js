const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const otpVerification = require("../models/OTPVerification");
const User = require("../models/User");
// const { DbService, TokenService, ErrorHandler } = require("../services");
const TokenService = require("./token.service");
  const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
  const JWT_EXPIRES_IN = "7d";

  function generateOTP() {
    return crypto.randomInt(100000, 1000000).toString();
  }

  function signToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }

  class FunctionsService {
    async getOTP(data) {
    data.otp = generateOTP();
    data.expires_at = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
      let user = await otpVerification.findOneAndUpdate(
        {email: data.email},               // e.g. { email }
        { $set: data },       // fields to create/update
        {
          new: true,          // return updated doc
          upsert: true,       // create if not exists
          runValidators: true // apply schema validation
        }
      );
      console.log('============> returning user from otp service ', user)
      return { user };
    }

    async verifyOTP({email, otp}) {
      const userotp = await otpVerification.findOne({ email, otp }).select("_id email role otp service_type expires_at disabled profile_completed");
      // if (!user) throw new Error("Invalid credentials");
      if(!userotp) {
        return { message: "Invalid email Id or OTP"};
      }

      if (userotp.disabled) {
        throw new Error("Account disabled");
      }

      if (new Date(userotp.expires_at) < new Date()) {
        throw new Error("OTP has expired");
      }

      if (otp !== userotp.otp) throw new Error("Invalid credentials");
      console.log('============> OTP verified successfully ', userotp)
      let userdata = {};
          userdata = await User.findOne({ email: email.toLowerCase() });
      // userdata = await DbService.findOne(User, { email: email.toLowerCase() });

      if (!userdata) {
         userdata = await User.create({
          email: email.toLowerCase(),
          role: userotp.service_type,
          full_name : email
        });
        // userdata = await DbService.create(User, {
        //   email: email.toLowerCase(),
        //   role: userotp.service_type,
        //   full_name : email
        // });
      }
      console.log('============> userdata after otp verification ', userdata)
      const user = userdata;


      const token = await TokenService.create({ _id: user._id });
      console.log('============> token ', token)
      // const token = signToken(user);
      return { user, token };
    }

  }

  module.exports = new FunctionsService();
  