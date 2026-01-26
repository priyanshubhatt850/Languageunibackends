const mongoose = require('mongoose');
const { Schema } = mongoose;

const LanguageSchema = new Schema(
{
    name: {
      type: String,
      required: true
    },
    flag: {
      type: String,
      required: true
    },
    code: {
      type: String
    },
    is_active: {
      type: Boolean,
      default: true
    },
    instructor_count: {
      type: Number,
      default: 0
    },
    learner_count: {
      type: Number,
      default: 0
    },
    display_order: {
      type: Number,
      default: 0
    }
  }, { timestamps: true });

module.exports = mongoose.model('Language', LanguageSchema);
