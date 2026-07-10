const mongoose = require('mongoose');
const { ObjectId } = require('seed/lib/seed');
const { Schema } = mongoose;

const ChatConversationSchema = new Schema(
{
    student_id: {
      type: mongoose.Schema.ObjectId,
      ref:"User",
      required: true
    },
    course_id: {
      type: mongoose.Schema.ObjectId,
      ref:"Course"
    },
    subject: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: [ "query", "report", "support", "general" ],
      default: "query"
    },
    status: {
      type: String,
      enum: [ "open", "closed", "resolved" ],
      default: "open"
    },
    last_message_at: {
      type: String
    },
    unread_admin_count: {
      type: Number,
      default: 0
    },
    unread_student_count: {
      type: Number,
      default: 0
    }
  }, { timestamps: true });

// Indexes
ChatConversationSchema.index({ student_id: 1 });
ChatConversationSchema.index({ course_id: 1 });
ChatConversationSchema.index({ status: 1 });
ChatConversationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ChatConversation', ChatConversationSchema);
