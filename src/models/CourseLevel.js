const mongoose = require('mongoose');
const { Schema } = mongoose;

const CourseLevelSchema = new Schema(
{
    language_id: {
      type: mongoose.Schema.ObjectId,
      ref:"languages",
      required: true
    },
    level_name: {
      type: String,
      required: true
    },
    level_type: {
      type: String,
      enum: [ "standard", "exam" ],
      default: "standard"
    },
    description: {
      type: String
    },
    learning_goals: [ {
        type: String
      } ],
    price: {
      type: Number,
      required: true
    },
    discount_price: {
      type: Number
    },
    duration_hours: {
      type: Number,
      default: 0
    },
    instructor_id: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    instructor_hourly_rate: {
      type: Number
    },
    thumbnail_url: {
      type: String
    },
    status: {
      type: String,
      enum: [ "draft", "published", "archived" ],
      default: "draft"
    },
    enrolled_count: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 0
    },
    display_order: {
      type: Number,
      default: 0
    }
  }, { timestamps: true });

// Indexes
CourseLevelSchema.index({ language_id: 1 });
CourseLevelSchema.index({ level_name: 1 });
CourseLevelSchema.index({ level_type: 1 });
CourseLevelSchema.index({ instructor_id: 1 });
CourseLevelSchema.index({ status: 1 });
CourseLevelSchema.index({ display_order: 1 });
// Compound index for aggregation performance
CourseLevelSchema.index({ _id: 1, status: 1 });

module.exports = mongoose.model('CourseLevel', CourseLevelSchema);
