const mongoose = require('mongoose');
const { Schema } = mongoose;

const BadgeSchema = new Schema(
{
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    icon: {
      type: String,
      required: true
    },
    criteria: {
      type: String
    },
    points_required: {
      type: Number,
      default: 0
    },
    rarity: {
      type: String,
      enum: [ "common", "rare", "epic", "legendary" ],
      default: "common"
    }
  }, { timestamps: true });

module.exports = mongoose.model('Badge', BadgeSchema);
