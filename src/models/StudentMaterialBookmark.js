const mongoose = require('mongoose');
const { Schema } = mongoose;

const StudentMaterialBookmarkSchema = new Schema(
{
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref:"User",
      required: true
    },
    material_id: {
      type: mongoose.Schema.ObjectId,
      ref:"StudyMaterial",
      required: true
    },
    level_id: {
      type: mongoose.Schema.ObjectId,
      ref:"CourseLevel",
      required: true
    },
    is_bookmarked: {
      type: Boolean,
      default: true
    }
  }, { timestamps: true });

// Indexes
StudentMaterialBookmarkSchema.index({ user_id: 1 });
StudentMaterialBookmarkSchema.index({ material_id: 1 });
StudentMaterialBookmarkSchema.index({ level_id: 1 });
StudentMaterialBookmarkSchema.index({ is_bookmarked: 1 });

module.exports = mongoose.model('StudentMaterialBookmark', StudentMaterialBookmarkSchema);
