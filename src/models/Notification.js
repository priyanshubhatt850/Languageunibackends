const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotificationSchema = new Schema(
{
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref:"User",
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: [ "info", "success", "warning", "course", "payment", "message", "system" ],
      default: "info"
    },
    link: {
      type: String
    },
    is_read: {
      type: Boolean,
      default: false
    }
  }, { timestamps: true });

// Indexes
NotificationSchema.index({ user_id: 1 });
NotificationSchema.index({ type: 1 });
NotificationSchema.index({ is_read: 1 });
NotificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', NotificationSchema);
