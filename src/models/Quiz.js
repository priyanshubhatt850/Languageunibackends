const mongoose = require('mongoose');
const { Schema } = mongoose;

const QuizSchema = new Schema(
{
    course_id: {
      type: mongoose.Schema.ObjectId,
      ref:"Course",
      required: true
    },
    lesson_id: {
      type: mongoose.Schema.ObjectId,
      ref:"Lesson"
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    type: {
      type: String,
      enum: [ "quiz", "mock_test", "assignment" ],
      default: "quiz"
    },
    time_limit_minutes: {
      type: Number
    },
    passing_score: {
      type: Number,
      default: 70
    },
    questions: [ {
        id: {
          type: String
        },
        question: {
          type: String
        },
        type: {
          type: String,
          enum: [ "multiple_choice", "true_false", "fill_blank", "short_answer" ]
        },
        options: [ {
            type: String
          } ],
        correct_answer: {
          type: String
        },
        points: {
          type: Number
        },
        explanation: {
          type: String
        }
      } ],
    total_points: {
      type: Number
    },
    is_active: {
      type: Boolean,
      default: true
    }
  }, { timestamps: true });

// Indexes
QuizSchema.index({ course_id: 1 });
QuizSchema.index({ lesson_id: 1 });
QuizSchema.index({ type: 1 });
QuizSchema.index({ is_active: 1 });

module.exports = mongoose.model('Quiz', QuizSchema);
