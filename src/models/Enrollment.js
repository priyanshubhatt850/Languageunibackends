const mongoose = require('mongoose');
const { Schema } = mongoose;

const EnrollmentSchema = new Schema(
{
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref:"User",
      required: true
    },
    course_id: {
      type: mongoose.Schema.ObjectId,
      ref:"Course",
      required: true
    },
    instructor_id: {
      type: mongoose.Schema.ObjectId,
      ref:"User"
    },

    courseTransactionId:{
       type:mongoose.Schema.ObjectId,
        ref:"courseTransactions"
    },
    status: {
      type: String,
      enum: [ "active", "completed", "cancelled", "expired" ],
      default: "active"
    },
    progress_percentage: {
      type: Number,
      default: 0
    },
    completed_lessons: [ {
        type: String
      } ],
    payment_amount: {
      type: Number
    },
    payment_status: {
      type: String,
      enum: [ "pending", "completed", "refunded" ],
      default: "pending"
    },
    certificate_issued: {
      type: Boolean,
      default: false
    },
    certificate_url: {
      type: String
    },
    enrolled_date: {
      type: String
    },
    start_date: {
      type: String
    },
    end_date: {
      type: String
    },
    completed_date: {
      type: String
    }
  }, { timestamps: true });

// Indexes
EnrollmentSchema.index({ user_id: 1 });
EnrollmentSchema.index({ course_id: 1 });
EnrollmentSchema.index({ instructor_id: 1 });
EnrollmentSchema.index({ status: 1 });
EnrollmentSchema.index({ payment_status: 1 });
EnrollmentSchema.index({ createdAt: -1 });
EnrollmentSchema.index({ user_id: 1, payment_status: 1, course_id: 1 }); // Compound index for performance on course queries

module.exports = mongoose.model('Enrollment', EnrollmentSchema);
