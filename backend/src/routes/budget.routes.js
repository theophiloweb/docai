/**
 * Rotas de Orçamentos
 * 
 * Este arquivo define as rotas relacionadas aos orçamentos.
 * 
 * @author Doc.AI Team
 */

const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budget.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

// Rotas para orçamentos
router.get('/records', budgetController.getAllBudgets);
router.get('/dashboard', budgetController.getDashboardData);
router.get('/records/:id', budgetController.getBudgetDetails);
router.put('/records/:id/status', budgetController.updateBudgetStatus);

// Rotas para grupos de orçamentos
router.get('/groups', budgetController.getBudgetGroups);
router.put('/group', budgetController.updateBudgetGroup);
router.put('/group/add', budgetController.addBudgetToGroup);
router.delete('/group/remove/:id', budgetController.removeBudgetFromGroup);

module.exports = router;
