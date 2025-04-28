import mongoose from "mongoose";


const budgetSchema = new mongoose.Schema({
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
            "grocery",
            "other",
        ],
        required: true,
    },
    transactionType:{
        type: String,
        enum: ["income", "expense"],
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    }
},{timestamps: true});

const Budget = mongoose.model("Budget", budgetSchema);
export default Budget;
