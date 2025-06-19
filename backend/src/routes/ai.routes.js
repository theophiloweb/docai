/**
 * Rotas de IA
 * 
 * Este arquivo define as rotas relacionadas à inteligência artificial.
 * 
 * @author Doc.AI Team
 */

const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Middleware para verificar se o usuário é administrador
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Acesso negado. Apenas administradores podem acessar este recurso.'
  });
};

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

// Rotas para IA
router.post('/budget/insights', aiController.generateBudgetInsights);

// Rotas de prompts (protegidas por papel de administrador)
router.get('/prompts', isAdmin, aiController.getPrompts);
router.get('/prompts/:id', isAdmin, aiController.getPrompt);
router.post('/prompts', isAdmin, aiController.createPrompt);
router.put('/prompts/:id', isAdmin, aiController.updatePrompt);
router.delete('/prompts/:id', isAdmin, aiController.deletePrompt);
router.patch('/prompts/:id/status', isAdmin, aiController.updatePromptStatus);

module.exports = router;
