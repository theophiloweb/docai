/**
 * Rotas de administração
 * 
 * Este arquivo define as rotas relacionadas à administração do sistema.
 * 
 * @author Doc.AI Team
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
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

// Rotas protegidas por autenticação e papel de administrador
router.use(authMiddleware);
router.use(isAdmin);

// Rotas do dashboard
router.get('/dashboard', adminController.getDashboardData);

// Rotas de usuários
router.get('/users', adminController.getUsers);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);
router.patch('/users/:id/status', adminController.updateUserStatus);

// Rotas de configurações de IA
const aiSettingsController = require('../controllers/ai.settings.controller');
router.get('/ai-settings', aiSettingsController.getAISettings);
router.post('/ai-settings', aiSettingsController.createAISetting);
router.put('/ai-settings/:id', aiSettingsController.updateAISetting);
router.delete('/ai-settings/:id', aiSettingsController.deleteAISetting);
router.patch('/ai-settings/:id/status', aiSettingsController.updateAISettingStatus);
router.post('/ai-settings/:id/test', aiSettingsController.testAIConnection);

// Rotas de configurações do sistema
router.get('/settings', adminController.getSystemSettings);
router.put('/settings/:id', adminController.updateSystemSetting);
router.put('/settings', adminController.updateSystemSettings);

// Rotas de perfil do administrador
router.get('/profile', adminController.getAdminProfile);
router.put('/profile', adminController.updateAdminProfile);

// Rotas de logs
router.get('/logs', adminController.getLogs);

// Rotas de planos
router.get('/plans', adminController.getPlans);
router.post('/plans', adminController.createPlan);
router.put('/plans/:id', adminController.updatePlan);
router.delete('/plans/:id', adminController.deletePlan);

module.exports = router;
