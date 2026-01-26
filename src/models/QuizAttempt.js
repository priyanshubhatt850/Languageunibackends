const mongoose = require('mongoose');
const { Schema } = mongoose;

const QuizAttemptSchema = new Schema(
{
    quiz_id: {
      type: mongoose.Schema.ObjectId,
      ref:"Quiz",
      required: true
    },
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref:"users",
      required: true
    },
    course_id: {
      type: mongoose.Schema.ObjectId,
      ref:"Course",
    },
    answers: [ {
        question_id: {
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
    passed: {
      type: Boolean
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

module.exports = mongoose.model('QuizAttempt', QuizAttemptSchema);
