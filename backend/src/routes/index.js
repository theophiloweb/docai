/**
 * Índice de Rotas
 * 
 * Este arquivo configura todas as rotas da API.
 * 
 * @author Doc.AI Team
 */

const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const documentRoutes = require('./document.routes');
const adminRoutes = require('./admin.routes');
const aiRoutes = require('./ai.routes');
const medicalRoutes = require('./medical.routes');
const financialRoutes = require('./financial.routes');
const budgetRoutes = require('./budget.routes');
const documentProcessingRoutes = require('./document.processing.routes');
const healthController = require('../controllers/health.controller');

// Rota de saúde para verificar se o servidor está funcionando
router.get('/health', healthController.checkHealth);

// Rotas de autenticação
router.use('/auth', authRoutes);

// Rotas de usuário
router.use('/users', userRoutes);

// Rotas de documentos
router.use('/documents', documentRoutes);

// Rotas de processamento de documentos
router.use('/documents', documentProcessingRoutes);

// Rotas de administração
router.use('/admin', adminRoutes);

// Rotas de IA
router.use('/ai', aiRoutes);

// Rotas médicas
router.use('/medical', medicalRoutes);

// Rotas financeiras
router.use('/financial', financialRoutes);

// Rotas de orçamentos
router.use('/budget', budgetRoutes);

module.exports = router;
