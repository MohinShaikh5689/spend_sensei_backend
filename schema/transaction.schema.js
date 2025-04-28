import mongoose from "mongoose";


const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    transactionType: {
        type: String,
        enum: ["income", "expense"],
        required: true,
    },
    category: {
        type: String,
        enum: [
            "salary",
            "business",
            "investment",
            "food",
            "transportation",
            "entertainment",
            "health",
            "education",
            "shopping",
            "balance forward",
            "grocery",
            "other",
        ],
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    }
},{timestamps: true});

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
