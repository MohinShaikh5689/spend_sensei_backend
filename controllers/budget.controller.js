import Budget from "../schema/budget.schema.js";
import Transaction from "../schema/transaction.schema.js";
import Chat from "../schema/chat.schema.js";
import Groq from 'groq-sdk';


export const createBudget = async (req, res) => {
    try {
        const userId = req.user._id;
        const { amount, description, category } = req.body;
        const transactionType = "expense";
        if (!amount || !description || !category || !transactionType) {
            res.status(400).json({ message: "All fields are required" });
        }
        const checkIfCategoryExists = await Budget.findOne({
            userId,
            category,
        });
        if (checkIfCategoryExists) {
           return res.status(400).json({ message: "Category already exists if you want to change it you can try editing it" });
        }

        await Budget.create({
            userId,
            amount,
            description,
            category,
            transactionType,
        });
        res.status(201).json({ message: "Budget created successfully" });

    } catch (error) {

        res.status(500).json({ 
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error"
         });
    }
};

export const getBudgetsByMonth = async (req, res) => {
    try {
        const userId = req.user._id;
        const { month, year } = req.body;
        const budgets = await Budget.find({
            userId,
            date: {
                $gte: new Date(year, month - 1, 1),
                $lt: new Date(year, month, 1),
            },
        });
        res.status(200).json(budgets);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllBudgets = async (req, res) => {
    try {
        const userId = req.user._id;
        const budgets = await Budget.find({ userId });
        res.status(200).json(budgets);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteBudget = async (req, res) => {
    try {
        const userId = req.user._id;
        const { budgetId } = req.params;
        const budget = await Budget.findOneAndDelete({ _id: budgetId, userId });
        if (!budget) {
            return res.status(404).json({ message: "Budget not found" });
        }
        res.status(200).json({ message: "Budget deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const editBudget = async (req, res) => {
    try {
        const userId = req.user._id;
        const { budgetId } = req.params;
        const { amount, description, category, transactionType } = req.body;
        const budget = await Budget.findOneAndUpdate(
            { _id: budgetId, userId },
            { amount, description, category, transactionType },
            { new: true }
        );
        if (!budget) {
            return res.status(404).json({ message: "Budget not found" });
        }
        res.status(200).json(budget);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const chatWithAi = async (req, res) => {
    const userId = req.user._id;
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ message: "Message is required" });
    }

    try {
        // Create the Groq client
        const client = new Groq({
            apiKey: process.env.GROQ_API_KEY,
        });

        const promptContent =
            `This is ${req.user.name}'s question: "${message}"
            
             make json of message data given by user if it's related to income and expense transactions and just give json data and transaction saved to DB and nothing more no other reply.
            
            Categories: salary, business, investment, food, transportation, entertainment, health, education, shopping, balance forward, grocery, other
            
            Transaction types: income, expense
            
            JSON format example:
            {
                "amount": 100,
                "description": "Sample description", 
                "transactionType": "income",
                "category": "salary"
            }`

        const chatCompletion = await client.chat.completions.create({
            messages: [{ role: 'user', content: promptContent }],
            model: 'llama3-8b-8192',
        });


        const reply = chatCompletion.choices[0].message.content;


        const jsonResponse = JSON.parse(reply);

        if (jsonResponse) {
            const { amount, description, category, transactionType } = jsonResponse;
            const transaction = await Transaction.create({
                userId,
                amount,
                description,
                category,
                transactionType,
            });
            if (transaction) {
                await Chat.create({
                    message,
                    user: userId,
                    botReply: "Transaction saved successfully in Database",
                });
                return res.status(200).json({ message: "Transaction Saved successfully in Database" });
            }
            else {
                return res.status(500).json({ message: "Failed to save transaction" });
            }
        }
    } catch (error) {
        return res.status(500).json({
            message: "Failed to generate AI response",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

export const chatWithFinancialAdvisor = async (req, res) => {
    const userId = req.user._id;
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ message: "Message is required" });
    }

    try {
        // Get user's budget and transaction data to provide context
        
        // Create the Groq client
        const client = new Groq({
            apiKey: process.env.GROQ_API_KEY,
        });

        const promptContent = 
            `You are a financial advisor. This is ${req.user.name}'s question: "${message}`

        const chatCompletion = await client.chat.completions.create({
            messages: [{ role: 'user', content: promptContent }],
            model: 'llama3-8b-8192',
            max_tokens: 500
        });

        const reply = chatCompletion.choices[0].message.content;
        
       
        await Chat.create({
            message,
            user: userId,
            botReply: reply
        });
        
      
        return res.status(200).json({ message: reply });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to generate AI response",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

export const getAllChats = async (req, res) => {
    try {
        const userId = req.user._id;
        const chats = await Chat.find({ user: userId })

        if (!chats) {
            return res.status(404).json({ message: "No chats found" });
        }

        res.status(200).json(chats);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};