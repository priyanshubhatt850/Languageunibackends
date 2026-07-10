const mongoose = require('mongoose');
const { Schema } = mongoose;

const CartSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  items: [{
    type: Schema.Types.ObjectId,
    ref: 'CourseLevel'
  }],
  wishlist: [{
    type: Schema.Types.ObjectId,
    ref: 'CourseLevel'
  }],
  coupon_code: {
    type: String,
    default: null
  },
  applied_coupon: {
    code: { type: String, default: null },
    discount_type: { type: String, enum: ['percentage', 'fixed', null], default: null },
    discount_value: { type: Number, default: 0 }
  },
  last_activity: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Cart', CartSchema);
