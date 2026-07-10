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
      ref:"User",
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

// Indexes
ChatMessageSchema.index({ conversation_id: 1 });
ChatMessageSchema.index({ sender_id: 1 });
ChatMessageSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
