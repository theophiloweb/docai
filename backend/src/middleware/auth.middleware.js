/**
 * Middleware de autenticação
 * 
 * Este middleware verifica se o usuário está autenticado.
 * 
 * @author Doc.AI Team
 */

const jwt = require('jsonwebtoken');
const { User } = require('../models');
const logger = require('../utils/logger');
require('dotenv').config();

/**
 * Middleware para verificar autenticação
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 * @param {Function} next - Função para passar para o próximo middleware
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Verificar se o token está presente
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticação não fornecido'
      });
    }
    
    // Extrair token
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticação não fornecido'
      });
    }
    
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuário
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    // Verificar status do usuário
    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Conta de usuário inativa ou suspensa'
      });
    }
    
    // Adicionar usuário à requisição
    req.user = user;
    
    next();
  } catch (error) {
    logger.error('Erro no middleware de autenticação:', error);
    
    return res.status(401).json({
      success: false,
      message: 'Token de autenticação inválido ou expirado'
    });
  }
};

module.exports = authMiddleware;
