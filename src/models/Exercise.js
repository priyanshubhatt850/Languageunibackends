const mongoose = require('mongoose');
const { Schema } = mongoose;

const ExerciseSchema = new Schema(
{
    level_id: {
      type: mongoose.Schema.ObjectId,
      ref:"CourseLevel",
      required: true
    },
    lesson_id: {
      type: mongoose.Schema.ObjectId,
      ref:"Lesson",
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
      enum: [ "fill_blank", "multiple_choice", "matching", "short_answer", "listening", "speaking" ],
      required: true
    },
    difficulty: {
      type: String,
      enum: [ "easy", "medium", "hard" ],
      default: "medium"
    },
    content: {
      instruction: {
        type: String
      },
      passage: {
        type: String
      },
      audio_url: {
        type: String
      },
      items: [ {
          type: Object
        } ]
    },
    time_limit_minutes: {
      type: Number,
      default: 10
    },
    points: {
      type: Number,
      default: 10
    },
    is_active: {
      type: Boolean,
      default: true
    },
    display_order: {
      type: Number,
      default: 0
    }
  }, { timestamps: true });

// Indexes
ExerciseSchema.index({ level_id: 1 });
ExerciseSchema.index({ lesson_id: 1 });
ExerciseSchema.index({ type: 1 });
ExerciseSchema.index({ difficulty: 1 });
ExerciseSchema.index({ is_active: 1 });
ExerciseSchema.index({ display_order: 1 });

module.exports = mongoose.model('Exercise', ExerciseSchema);
