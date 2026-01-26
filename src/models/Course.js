const mongoose = require('mongoose');
const { Schema } = mongoose;

const CourseSchema = new Schema(
{
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    createdBy:{
      type: mongoose.Schema.ObjectId,
      ref:"users",
    },
    language: {
      type: String,
      enum: [ "English", "Spanish", "French", "German", "Italian", "Portuguese", "Mandarin", "Japanese", "Korean", "Arabic" ],
      required: true
    },
    level: {
      type: String,
      enum: [ "A1", "A2", "B1", "B2", "C1", "C2" ],
      required: true
    },
    instructor_id: {
      type: mongoose.Schema.ObjectId,
      ref:"users",
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    discount_price: {
      type: Number
    },
    thumbnail_url: {
      type: String
    },
    duration_hours: {
      type: Number
    },
    total_lessons: {
      type: Number
    },
    status: {
      type: String,
      enum: [ "draft", "published", "archived" ],
      default: "draft"
    },
    category: {
      type: String,
      enum: [ "General", "Business", "Conversation", "Grammar", "Vocabulary", "Exam Prep" ],
      default: "General"
    },
    features: [ {
        type: String
      } ],
    has_live_classes: {
      type: Boolean,
      default: true
    },
    has_recorded_lectures: {
      type: Boolean,
      default: true
    },
    includes_materials: {
      type: Boolean,
      default: true
    },
    level_structure: {
      A1: {
        lessons_count: {
          type: Number
        },
        practice_exercises: {
          type: Number
        },
        resources: [ {
            type: String
          } ]
      },
      A2: {
        lessons_count: {
          type: Number
        },
        practice_exercises: {
          type: Number
        },
        resources: [ {
            type: String
          } ]
      },
      B1: {
        lessons_count: {
          type: Number
        },
        practice_exercises: {
          type: Number
        },
        resources: [ {
            type: String
          } ]
      },
      B2: {
        lessons_count: {
          type: Number
        },
        practice_exercises: {
          type: Number
        },
        resources: [ {
            type: String
          } ]
      }
    },
    enrolled_count: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 0
    },
    reviews_count: {
      type: Number,
      default: 0
    }
  }, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);
