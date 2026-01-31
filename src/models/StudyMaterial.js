const mongoose = require('mongoose');
const { Schema } = mongoose;

const StudyMaterialSchema = new Schema(
{
    level_id: {
      type: mongoose.Schema.ObjectId,
      ref:"CourseLevel",
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    material_type: {
      type: String,
      enum: [ "reading", "listening", "writing", "grammar", "vocabulary", "video", "live_session" ],
      required: true
    },
    file_url: {
      type: String
    },
    live_session_link: {
      type: String
    },
    scheduled_date: {
      type: String
    },
    duration_minutes: {
      type: Number,
      default: 0
    },
    is_free_preview: {
      type: Boolean,
      default: false
    },
    display_order: {
      type: Number,
      default: 0
    }
  }, { timestamps: true });

// Indexes
StudyMaterialSchema.index({ level_id: 1 });
StudyMaterialSchema.index({ title: 1 });
StudyMaterialSchema.index({ material_type: 1 });
StudyMaterialSchema.index({ is_free_preview: 1 });
StudyMaterialSchema.index({ display_order: 1 });

module.exports = mongoose.model('StudyMaterial', StudyMaterialSchema);
