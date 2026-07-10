const mongoose = require('mongoose');
const { Schema } = mongoose;

const WalletSchema = new Schema(
{
    instructor_id: {
      type: mongoose.Schema.ObjectId,
      ref:"User",
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
    currency: {
      type: String,
      default: "USD"
    }
  }, { timestamps: true });

// Indexes
WalletSchema.index({ instructor_id: 1 });
WalletSchema.index({ balance: -1 });

module.exports = mongoose.model('Wallet', WalletSchema);
