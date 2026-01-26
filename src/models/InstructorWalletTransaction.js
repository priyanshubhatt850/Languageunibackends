const mongoose = require('mongoose');
const { Schema } = mongoose;

const InstructorWalletTransactionSchema = new Schema(
{
    instructor_id: {
      type: mongoose.Schema.ObjectId,
      ref:"users",
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

module.exports = mongoose.model('InstructorWalletTransaction', InstructorWalletTransactionSchema);
