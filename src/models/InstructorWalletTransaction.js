const mongoose = require('mongoose');
const { Schema } = mongoose;

const InstructorWalletTransactionSchema = new Schema(
{
    instructor_id: {
      type: mongoose.Schema.ObjectId,
      ref:"User",
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      enum: [ "credit", "debit", "withdrawal" ],
      required: true
    },
    source: {
      type: String,
      enum: [ "teaching_session", "withdrawal_request", "refund" ],
      required: true
    },
    related_entity_id: {
      type: String
    },
    description: {
      type: String
    },
    balance_before: {
      type: Number
    },
    balance_after: {
      type: Number
    }
  }, { timestamps: true });

// Indexes
InstructorWalletTransactionSchema.index({ instructor_id: 1 });
InstructorWalletTransactionSchema.index({ type: 1 });
InstructorWalletTransactionSchema.index({ source: 1 });
InstructorWalletTransactionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('InstructorWalletTransaction', InstructorWalletTransactionSchema);
