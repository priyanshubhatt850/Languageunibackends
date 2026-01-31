const mongoose = require('mongoose');
const { Schema } = mongoose;

const OTPVerificationSchema = new Schema(
{
    email: {
      type: String,
      required: true
    },
    otp: {
      type: String,
      required: true
    },
    service_type: {
      type: String,
      enum: [ "instructor", "candidate","user" ,"student"],
      required: true
    },
    expires_at: {
      type: String,
      required: true
    },
    verified: {
      type: Boolean,
      default: false
    }
  }, { timestamps: true });

// Indexes
OTPVerificationSchema.index({ email: 1 });
OTPVerificationSchema.index({ service_type: 1 });
OTPVerificationSchema.index({ verified: 1 });
OTPVerificationSchema.index({ expires_at: 1 });

module.exports = mongoose.model('OTPVerification', OTPVerificationSchema);
