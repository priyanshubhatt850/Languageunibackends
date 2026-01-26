const mongoose = require('mongoose');
const { Schema } = mongoose;

const MessageSchema = new Schema(
{
    sender_id: {
      type: mongoose.Schema.ObjectId,
      ref:"users",
      required: true
    },
    recipient_id: {
      type: mongoose.Schema.ObjectId,
      ref:"users",
      required: true
    },
    subject: {
      type: String
    },
    content: {
      type: String,
      required: true
    },
    is_read: {
      type: Boolean,
      default: false
    },
    thread_id: {
      type: String
    }
  }, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
