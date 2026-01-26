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
      ref:"users",
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

module.exports = mongoose.model('Review', ReviewSchema);
