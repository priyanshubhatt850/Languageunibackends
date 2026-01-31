const mongoose = require('mongoose');
const { Schema } = mongoose;

const FlashcardSchema = new Schema(
{
    level_id: {
      type: mongoose.Schema.ObjectId,
      ref:"CourseLevel",
      required: true
    },
    lesson_id: {
      type: mongoose.Schema.ObjectId,
      ref:"Lesson"
    },
    deck_name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    cards: [ {
        id: {
          type: String
        },
        front: {
          type: String,
          required: true
        },
        back: {
          type: String,
          required: true
        },
        example: {
          type: String
        },
        audio_url: {
          type: String
        }
      } ],
    total_cards: {
      type: Number,
      default: 0
    },
    category: {
      type: String,
      enum: [ "vocabulary", "grammar", "phrases", "idioms", "pronunciation" ],
      default: "vocabulary"
    },
    difficulty: {
      type: String,
      enum: [ "easy", "medium", "hard" ],
      default: "medium"
    },
    is_public: {
      type: Boolean,
      default: true
    },
    display_order: {
      type: Number,
      default: 0
    }
  }, { timestamps: true });

// Indexes
FlashcardSchema.index({ level_id: 1 });
FlashcardSchema.index({ lesson_id: 1 });
FlashcardSchema.index({ deck_name: 1 });
FlashcardSchema.index({ category: 1 });
FlashcardSchema.index({ difficulty: 1 });
FlashcardSchema.index({ is_public: 1 });
FlashcardSchema.index({ display_order: 1 });

module.exports = mongoose.model('Flashcard', FlashcardSchema);
