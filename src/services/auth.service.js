const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { env } = require("../constants");

const JWT_SECRET = env.JWT_SECRET;
const JWT_EXPIRES_IN = "7d";

function signToken(user) {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

class AuthService {
  async register(data) {
    const existing = await User.findOne({ email: data.email });
    if (existing) throw new Error("Email already registered");

    let user = await User.create(data);
    const token = signToken(user);
    delete user.password;
    return { user, token };
  }

  async login(email, password) {
    const user = await User.findOne({ email }).select("+password");

    // if (!user) throw new Error("Invalid credentials");
    if (!user) {
      throw new Error("Invalid credentials");
    }

    if (user.disabled) {
      throw new Error("Account disabled");
    }

    const match = await user.comparePassword(password);
    if (!match) throw new Error("Invalid credentials");

    const token = signToken(user);
    return { user, token };
  }

  async getMe(userId) {
    return User.findById(userId);
  }
  async updateMe(userId, data) {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const ALLOWED_FIELDS = [
      'full_name', 'firstName', 'lastName',
      'phone', 'phoneNo', 'avatar_url', 'profileImgs',
      'address', 'city', 'state', 'country', 'countryCode',
      'learning_languages', 'learning_interests', 'onboarding_completed',
    ];

    Object.keys(data).forEach((key) => {
      if (ALLOWED_FIELDS.includes(key)) {
        user[key] = data[key];
      }
    });

    await user.save();
    user.password = undefined;
    return user;
  }
}

module.exports = new AuthService();
