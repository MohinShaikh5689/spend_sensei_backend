import express from 'express';
import { createBudget, getAllBudgets, getBudgetsByMonth, deleteBudget, editBudget, chatWithAi, chatWithFinancialAdvisor, getAllChats } from '../controllers/budget.controller.js';
import { authChecker } from '../middleware/authchecker.js';

const router = express.Router();

router.post('/', authChecker, createBudget);
router.get('/', authChecker, getAllBudgets);
router.get('/chats', authChecker, getAllChats);
router.post('/monthly', authChecker, getBudgetsByMonth);
router.post('/chat', authChecker, chatWithAi);
router.post('/financial-advisor', authChecker, chatWithFinancialAdvisor);
router.put('/:budgetId', authChecker, editBudget);
router.delete('/:budgetId', authChecker, deleteBudget);

export default router;
