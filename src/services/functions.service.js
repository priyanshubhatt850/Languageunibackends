const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const otpVerification = require("../models/OTPVerification");
const User = require("../models/User");
const TokenService = require("./token.service");
const { env } = require("../constants");
const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

function generateOTP() {
  return crypto.randomInt(100000, 1000000).toString();
}


class FunctionsService {
  async getOTP(data) {
    try {
      const { email, service_type } = data;

      // 1️⃣ Check if OTP record already exists
      const existingUser = await otpVerification.findOne({ email });

      // 2️⃣ If exists & role is DIFFERENT → block
      if (existingUser && existingUser.service_type !== service_type) {
        return {
          user: null,
          message: `This email is already assigned to a different role. Please try another email.`
        };
      }

      // 3️⃣ Proceed normally (same role or new email)
      data.otp = generateOTP();
      data.expires_at = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

      const user = await otpVerification.findOneAndUpdate(
        { email },
        { $set: data },
        {
          new: true,
          upsert: true,
          runValidators: true
        }
      );

      return { user, message: "Otp Sent Successfully " };

    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async verifyOTP({ email, otp }) {
    const userotp = await otpVerification.findOne({ email, otp }).select("_id email role otp service_type expires_at disabled profile_completed");
    // if (!user) throw new Error("Invalid credentials");
    if (!userotp) {
      return { message: "Invalid email Id or OTP" };
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
        full_name: email
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
  async verifyGoogleToken({ googletoken, service_type }) {
    try {
      console.log("GOOGLE_CLIENT_ID from constants:", env.GOOGLE_CLIENT_ID);
      const ticket = await googleClient.verifyIdToken({
        idToken: googletoken,
        audience: env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const { email, name, picture, sub } = payload;

      if (!sub) {
        throw new Error("Google identifier missing");
      }

      // 1️⃣ First try by googleId (BEST)
      let user = await User.findOne({ googleId: sub });

      // 2️⃣ If not found, fallback to email
      if (!user && email) {
        user = await User.findOne({ email: email.toLowerCase() });
      }

      // 3️⃣ Create user if still not found
      if (!user) {
        user = await User.create({
          email: email?.toLowerCase(),
          googleId: sub,
          role: service_type,
          full_name: name || email,
          profileImgs: picture,
          avatar_url: picture,
          loginType: "google",
        });
      }

      // 4️⃣ Link Google account if email exists but googleId missing
      if (user && !user.googleId) {
        user.googleId = sub;
        user.loginType = "google";
        await user.save();
      }

      const token = await TokenService.create({ _id: user._id });

      return { user, token };

    } catch (error) {
      console.error("Google token verification failed:", error);
      throw new Error("Invalid Google token");
    }
  }
}

module.exports = new FunctionsService();
