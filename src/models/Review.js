const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReviewSchema = new Schema(
{
    course_id: {
      type: mongoose.Schema.ObjectId,
      ref:"Course",
      required: true
    },
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref:"User",
      required: true
    },
    rating: {
      type: Number,
      required: true
    },
    comment: {
      type: String
    },
    is_approved: {
      type: Boolean,
      default: true
    }
  }, { timestamps: true });

// Indexes
ReviewSchema.index({ course_id: 1 });
ReviewSchema.index({ user_id: 1 });
ReviewSchema.index({ rating: -1 });
ReviewSchema.index({ is_approved: 1 });
ReviewSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Review', ReviewSchema);
