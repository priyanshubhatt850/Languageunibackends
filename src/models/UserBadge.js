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

// Indexes
UserBadgeSchema.index({ user_id: 1 });
UserBadgeSchema.index({ badge_id: 1 });
UserBadgeSchema.index({ earned_date: 1 });

module.exports = mongoose.model('UserBadge', UserBadgeSchema);
