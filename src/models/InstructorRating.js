const mongoose = require('mongoose');
const { Schema } = mongoose;

const InstructorRatingSchema = new Schema(
{
    student_id: {
      type: mongoose.Schema.ObjectId,
      ref:"users",
      required: true
    },
    instructor_id: {
      type: mongoose.Schema.ObjectId,
      ref:"users",
      required: true
    },
    course_id: {
      type: mongoose.Schema.ObjectId,
      ref:"courses",
      required: true
    },
    rating: {
      type: Number,
      required: true
    },
    comment: {
      type: String
    }
  }, { timestamps: true });

// Indexes
InstructorRatingSchema.index({ student_id: 1 });
InstructorRatingSchema.index({ instructor_id: 1 });
InstructorRatingSchema.index({ course_id: 1 });
InstructorRatingSchema.index({ rating: -1 });
InstructorRatingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('InstructorRating', InstructorRatingSchema);
