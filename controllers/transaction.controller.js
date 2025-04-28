import Transaction from "../schema/transaction.schema.js";

export const createTransaction = async (req, res) => {
    const userId = req.user._id;
    const { amount, description, transactionType, category } = req.body;
    try {
         await Transaction.create({
            userId,
            amount,
            description,
            transactionType,
            category,
        });
        res.status(201).json({ message: "Transaction created successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

export const editTransaction = async (req, res) => {
    const { transactionId } = req.params;
    const { amount, description, transactionType, category } = req.body;
    try {
        const transaction = await Transaction.findByIdAndUpdate(
            transactionId,
            {
                amount,
                description,
                transactionType,
                category,
            },
            { new: true }
        );
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.status(200).json({ message: "Transaction updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

export const deleteTransaction = async (req, res) => {
    const { transactionId } = req.params;
    try {
        const transaction = await Transaction.findByIdAndDelete(transactionId);
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

export const getTransactions = async (req, res) => {
    const userId = req.user._id;
    try {
        const transactions = await Transaction.find({ userId });

        if (!transactions) {
            return res.status(404).json({ message: "No transactions found" });
        }

        res.status(200).json(transactions);
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

export const getTransactionsByMonth = async (req, res) => {
    try {
        const userId = req.user._id;
        const { month, year } = req.body;
        
        // Convert to numbers and validate inputs
        const monthNum = Number(month);
        const yearNum = Number(year);
        
        if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12) {
            return res.status(400).json({ message: "Invalid month or year" });
        }

        // Create date boundaries for current and previous month
        const currentMonthStart = new Date(yearNum, monthNum - 1, 1);
        const nextMonthStart = new Date(yearNum, monthNum, 1);
        const prevMonthStart = new Date(yearNum, monthNum - 2, 1);

        // Check if previous month's balance has already been carried forward
        const balanceForwardExists = await Transaction.findOne({
            userId,
            date: { $gte: currentMonthStart, $lt: nextMonthStart },
            category: "balance forward",
            description: "Previous month balance"
        });

        // Get current month's transactions
        const transactions = await Transaction.find({
            userId,
            date: { $gte: currentMonthStart, $lt: nextMonthStart }
        });

        // If balance has already been carried forward, return transactions
        if (balanceForwardExists) {
            return res.status(200).json(transactions);
        }

        // Get previous month's transactions to calculate balance
        const prevMonthTransactions = await Transaction.find({
            userId,
            date: { $gte: prevMonthStart, $lt: currentMonthStart }
        });

        // Calculate previous month's balance
        const lastMonthBalance = prevMonthTransactions.reduce((acc, transaction) => 
            acc + (transaction.transactionType === "income" ? transaction.amount : -transaction.amount), 0);

        // Only carry forward positive balances
        if (lastMonthBalance > 0) {
            // Create a balance forward transaction
            await Transaction.create({
                userId,
                amount: lastMonthBalance,
                description: "Previous month balance",
                transactionType: "income",
                category: "balance forward",
                date: currentMonthStart 
            });
            
            // Return updated transactions including the new balance forward entry
            return res.status(200).json([
                {
                    userId,
                    amount: lastMonthBalance,
                    description: "Previous month balance",
                    transactionType: "income",
                    category: "balance forward",
                    date: currentMonthStart
                },
                ...transactions
            ]);
        }
        
        return res.status(200).json(transactions);
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};