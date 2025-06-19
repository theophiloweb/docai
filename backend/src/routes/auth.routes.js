/**
 * Rotas de Autenticação
 * 
 * Este arquivo define as rotas relacionadas à autenticação.
 * 
 * @author Doc.AI Team
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const authControllerExtended = require('../controllers/authController');

// Rotas públicas
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Rota de login para administradores
router.post('/admin/login', authControllerExtended.adminLogin);

// Rotas protegidas
router.get('/me', authMiddleware, authController.me);

module.exports = router;
