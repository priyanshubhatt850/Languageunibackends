const mongoose = require('mongoose');
const { Schema } = mongoose;

const LessonSchema = new Schema(
{
    course_id: {
      type: mongoose.Schema.ObjectId,
      ref:"Course",
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    order: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      enum: [ "video", "live", "reading", "quiz", "assignment" ],
      default: "video",
      required: true
    },
    video_url: {
      type: String
    },
    duration_minutes: {
      type: Number
    },
    materials: [ {
        name: {
          type: String
        },
        url: {
          type: String
        },
        type: {
          type: String,
          enum: [ "pdf", "document", "book", "exercise", "audio", "other" ]
        }
      } ],
    is_free_preview: {
      type: Boolean,
      default: false
    },
    live_class_date: {
      type: String
    },
    live_class_link: {
      type: String
    },
    has_recording: {
      type: Boolean,
      default: true
    },
    level: {
      type: String,
      enum: [ "A1", "A2", "B1", "B2" ]
    },
    practice_content: [ {
        type: {
          type: String,
          enum: [ "exercise", "quiz", "assignment", "practice_dialogue" ]
        },
        title: {
          type: String
        },
        content_url: {
          type: String
        }
      } ]
  }, { timestamps: true });

// Indexes
LessonSchema.index({ course_id: 1 });
LessonSchema.index({ order: 1 });
LessonSchema.index({ type: 1 });
LessonSchema.index({ is_free_preview: 1 });
LessonSchema.index({ level: 1 });

module.exports = mongoose.model('Lesson', LessonSchema);
