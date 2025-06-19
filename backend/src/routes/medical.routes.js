/**
 * Rotas Médicas
 * 
 * Este arquivo define as rotas relacionadas aos registros médicos.
 * 
 * @author Doc.AI Team
 */

const express = require('express');
const router = express.Router();
const medicalController = require('../controllers/medical.controller');
const medicalAnalysisController = require('../controllers/medicalAnalysis.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Middleware de autenticação para todas as rotas
router.use(authMiddleware);

// Rota para obter dados do dashboard médico
router.get('/dashboard', medicalController.getDashboardData);

// Rota para obter análise médica geral
router.post('/analysis/general', medicalAnalysisController.getGeneralAnalysis);

// Rota para forçar nova análise médica
router.post('/analysis/force', medicalAnalysisController.forceNewAnalysis);

module.exports = router;
