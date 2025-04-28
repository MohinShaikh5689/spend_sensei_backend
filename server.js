import express from 'express';
import { config } from 'dotenv';
import { connectToDB } from './DB/connectToDB.js';
import cors from 'cors';

import userRoutes from './routes/user.Routes.js';
import transactionRoutes from './routes/transaction.Routes.js';
import budgetRoutes from './routes/budget.Routes.js';

const app = express();
config();
app.use(cors({
    origin: [
        'https://spend-sensei-frontend.vercel.app',
        process.env.FRONTEND_URL || 'http://localhost:3000'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/budget', budgetRoutes);

app.listen(PORT, () => {
    connectToDB();
});



