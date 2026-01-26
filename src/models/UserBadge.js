const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserBadgeSchema = new Schema(
{
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref:"users",
      required: true
    },
    badge_id: {
      type: mongoose.Schema.ObjectId,
      ref:"Badges",
      required: true
    },
    earned_date: {
      type: String
    }
  }, { timestamps: true });

module.exports = mongoose.model('UserBadge', UserBadgeSchema);
