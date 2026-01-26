const mongoose = require('mongoose');
const { Schema } = mongoose;

const InstructorWalletSchema = new Schema(
{
    instructor_id: {
      type: mongoose.Schema.ObjectId,
      ref:"users",
      required: true
    },
    balance: {
      type: Number,
      default: 0
    },
    total_earned: {
      type: Number,
      default: 0
    },
    total_withdrawn: {
      type: Number,
      default: 0
    },
    pending_approval_amount: {
      type: Number,
      default: 0
    }
  }, { timestamps: true });

module.exports = mongoose.model('InstructorWallet', InstructorWalletSchema);
