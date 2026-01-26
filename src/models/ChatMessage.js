const mongoose = require('mongoose');
const { Schema } = mongoose;

const ChatMessageSchema = new Schema(
{
    conversation_id: {
      type: mongoose.Schema.ObjectId,
      ref:"ChatConversation",
      required: true
    },
    sender_id: {
      type: mongoose.Schema.ObjectId,
      ref:"users",
      required: true
    },
    message: {
      type: String,
      required: true
    },
    is_read: {
      type: Boolean,
      default: false
    },
    attachment_url: {
      type: String
    }
  }, { timestamps: true });

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
