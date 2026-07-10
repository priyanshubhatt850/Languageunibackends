const mongoose = require('mongoose');
const { Schema } = mongoose;



courseTransactionsSchema = new Schema(
    {
        user_id: {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        },
        courseId: {
            type: mongoose.Schema.ObjectId,
            ref: "Course"
        },
        levelId: {
            type: mongoose.Schema.ObjectId,
            ref: "CourseLevel"
        },
        transaction_id: {
            type: String
        },
        amount: {
            type: Number,

        },
        discount_price: {
            type: Number
        },
        payment_type: {
            type: String
        },
        status: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending"
        },
        country:{
            type:String
        },
        ip:{
            type:String
        }
    }, { timestamps: true }
)

// Indexes
courseTransactionsSchema.index({ user_id: 1 });
courseTransactionsSchema.index({ courseId: 1 });
courseTransactionsSchema.index({ levelId: 1 });
courseTransactionsSchema.index({ status: 1 });
courseTransactionsSchema.index({ createdAt: -1 });

module.exports = mongoose.model('courseTransactions', courseTransactionsSchema);