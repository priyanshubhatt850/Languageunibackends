const mongoose = require('mongoose');
const { Schema } = mongoose;

const ExerciseAttemptSchema = new Schema(
{
    exercise_id: {
      type: mongoose.Schema.ObjectId,
      ref:"Exercise",
      required: true
    },
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref:"users",
      required: true
    },
    level_id: {
      type: mongoose.Schema.ObjectId,
      ref:"CourseLevel",
      required: true
    },
    answers: [ {
        item_id: {
          type: String
        },
        answer: {
          type: String
        },
        is_correct: {
          type: Boolean
        },
        points_earned: {
          type: Number
        }
      } ],
    score: {
      type: Number
    },
    percentage: {
      type: Number
    },
    time_taken_minutes: {
      type: Number
    },
    status: {
      type: String,
      enum: [ "in_progress", "submitted", "graded" ],
      default: "in_progress"
    }
  }, { timestamps: true });

module.exports = mongoose.model('ExerciseAttempt', ExerciseAttemptSchema);
