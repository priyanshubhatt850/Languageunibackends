const mongoose = require('mongoose');
const { Schema } = mongoose;

const TeachingSessionSchema = new Schema(
{
    instructor_id: {
      type: mongoose.Schema.ObjectId,
      ref:"users",
      required: true
    },
    student_id: {
      type: mongoose.Schema.ObjectId,
      ref:"users",
    },
    course_level_id: {
      type: mongoose.Schema.ObjectId,
      ref:"CourseLevel"

    },
    session_date: {
      type: String,
      required: true
    },
    hours_taught: {
      type: Number,
      default: 0,
      required: true
    },
    hourly_rate: {
      type: Number,
      required: true
    },
    amount_earned: {
      type: Number,
      default: 0
    },
    meet_link: {
      type: String
    },
    notes: {
      type: String
    },
    status: {
      type: String,
      enum: [ "pending", "approved", "rejected" ],
      default: "pending"
    },
    approved_by: {
      type: String
    },
    approved_date: {
      type: String
    },
    rejection_reason: {
      type: String
    }
  }, { timestamps: true });

module.exports = mongoose.model('TeachingSession', TeachingSessionSchema);
