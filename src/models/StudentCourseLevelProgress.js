const mongoose = require('mongoose');
const { Schema } = mongoose;

const StudentCourseLevelProgressSchema = new Schema(
{
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref:"users",
      required: true
    },
    course_level_id: {
      type: mongoose.Schema.ObjectId,
      ref:"CourseLevel",
      required: true
    },
    language_id: {
      type: mongoose.Schema.ObjectId,
      ref:"Language",
      required: true
    },
    total_lessons_completed: {
      type: Number,
      default: 0
    },
    overall_quiz_score: {
      type: Number,
      default: 0
    },
    quiz_attempts_count: {
      type: Number,
      default: 0
    },
    overall_exercise_score: {
      type: Number,
      default: 0
    },
    exercise_attempts_count: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: [ "not_started", "in_progress", "completed" ],
      default: "not_started"
    },
    progress_percentage: {
      type: Number,
      default: 0
    },
    last_activity_date: {
      type: String
    },
    time_spent_minutes: {
      type: Number,
      default: 0
    },
    enrolled_date: {
      type: String
    },
    completed_date: {
      type: String
    }
  }, { timestamps: true });

// Indexes
StudentCourseLevelProgressSchema.index({ user_id: 1 });
StudentCourseLevelProgressSchema.index({ course_level_id: 1 });
StudentCourseLevelProgressSchema.index({ language_id: 1 });
StudentCourseLevelProgressSchema.index({ status: 1 });
StudentCourseLevelProgressSchema.index({ progress_percentage: -1 });

module.exports = mongoose.model('StudentCourseLevelProgress', StudentCourseLevelProgressSchema);
