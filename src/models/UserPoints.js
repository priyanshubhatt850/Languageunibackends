const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserPointsSchema = new Schema(
{
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref:"users",
      required: true
    },
    total_points: {
      type: Number,
      default: 0
    },
    level: {
      type: Number,
      default: 1
    },
    rank: {
      type: String,
      enum: [ "Beginner", "Intermediate", "Advanced", "Expert", "Master" ],
      default: "Beginner"
    },
    points_history: [ {
        points: {
          type: Number
        },
        reason: {
          type: String
        },
        date: {
          type: String
        }
      } ]
  }, { timestamps: true });

module.exports = mongoose.model('UserPoints', UserPointsSchema);
