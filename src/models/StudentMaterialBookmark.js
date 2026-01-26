const mongoose = require('mongoose');
const { Schema } = mongoose;

const StudentMaterialBookmarkSchema = new Schema(
{
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref:"users",
      required: true
    },
    material_id: {
      type: mongoose.Schema.ObjectId,
      ref:"studyMaterials",
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

module.exports = mongoose.model('StudentMaterialBookmark', StudentMaterialBookmarkSchema);
