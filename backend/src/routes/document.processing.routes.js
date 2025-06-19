/**
 * Rotas de Processamento de Documentos
 * 
 * Este arquivo define as rotas relacionadas ao processamento de documentos.
 * 
 * @author Doc.AI Team
 */

const express = require('express');
const router = express.Router();
const documentProcessingController = require('../controllers/document.processing.controller');
const upload = require('../middleware/upload.middleware');
const authMiddleware = require('../middleware/auth.middleware');

// Aplicar middleware de autenticação
router.use(authMiddleware);

// Rota para processar um documento
router.post('/process', upload.single('file'), documentProcessingController.processDocument);

// Rota para confirmar o processamento de um documento
router.post('/confirm', documentProcessingController.confirmDocument);

// Rota para rejeitar o processamento de um documento
router.post('/reject', documentProcessingController.rejectDocument);

module.exports = router;
