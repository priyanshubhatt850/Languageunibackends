const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const { status } = require("../constants/messages/constant");

const userSchema = new mongoose.Schema(
  {
    /* ================= AUTH & IDS ================= */
    role: {
      type: String,
      enum: [
        "admin", "candidate", "user", "instructor", "student"
      ],
      default: "candidate",
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true
    },
    password: {
      type: String,
      select: false,
    },
    profileCompleted: {
      type: Boolean,
      default: false
    },
    avatar_url: {
      type: String
    },
    googleId: {
      type: String,
      index: true,
      sparse: true
    },

    learning_languages: [String],
    learning_interests: [String],
    onboarding_completed: {
      type: Boolean,
    },
    facebookId: String,
    googleId: String,
    appleIdentifier: String,
    socialType: String,

    /* ================= PROFILE ================= */
    full_name: {
      type: String,
      trim: true,
      // required: true,
    },

    firstName: String,
    lastName: {
      type: String,
      default: "",
    },
    profile_image_url: String,

    profileImgs: [String],
    bluerImg: [String],

    avatar: {
      type: mongoose.Schema.ObjectId,
      ref: "attribute",
    },
    loginType: {
      type: String,
      default: "manual"
    },
    /* ================= CONTACT ================= */
    phone: String,
    phoneNo: String,
    countryCode: String,
    address: String,

    city: String,
    state: String,
    country: String,

    locality: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
        default: [0, 0],
      },
    },
    issuperadmin:{
    type:Boolean
,
    default:false},
    /* ================= STATUS ================= */
    status: {
      type: String,
      enum: ["active", "pending", "suspended"],
      default: "pending",
    },

  },
  {
    timestamps: true,
  }
);


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};
// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ "locality.coordinates": "2dsphere" });
userSchema.index({ status: "text" });

module.exports = mongoose.model('User', userSchema);
