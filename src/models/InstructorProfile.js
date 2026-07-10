const mongoose = require('mongoose');
const { Schema } = mongoose;

const InstructorProfileSchema = new Schema(
{
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref:"User",
      required: true
    },
    display_name: {
      type: String,
      required: true
    },
    bio: {
      type: String
    },
    avatar_url: {
      type: String
    },
    languages_taught: [ {
        type: String
      } ],
    qualifications: [ {
        type: String
      } ],
    years_experience: {
      type: Number
    },
    verification_status: {
      type: String,
      enum: [ "pending", "approved", "rejected" ],
      default: "pending"
    },
    phone:{
      type:Number
    },
    resume_url:{
      type:String
    },
    phone_number:{
   type:String
    },
    payment_type: {
      type: String,
      enum: [ "monthly", "hourly" ],
      default: "hourly"
    },
    
    monthly_salary: {
      type: Number,
      default: 0
    },
    hourly_rate: {
      type: Number,
      default: 0
    },
    total_hours_taught: {
      type: Number,
      default: 0
    },
    revenue_share_percentage: {
      type: Number,
      default: 70
    },
    total_earnings: {
      type: Number,
      default: 0
    },
    pending_payout: {
      type: Number,
      default: 0
    },
    total_students: {
      type: Number,
      default: 0
    },
    average_rating: {
      type: Number,
      default: 0
    },
    social_links: {
      linkedin: {
        type: String
      },
      twitter: {
        type: String
      },
      website: {
        type: String
      }
    }
  }, { timestamps: true });

// Indexes
InstructorProfileSchema.index({ user_id: 1 });
InstructorProfileSchema.index({ display_name: 1 });
InstructorProfileSchema.index({ verification_status: 1 });
InstructorProfileSchema.index({ payment_type: 1 });
InstructorProfileSchema.index({ average_rating: -1 });

module.exports = mongoose.model('InstructorProfile', InstructorProfileSchema);
