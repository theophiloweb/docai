/**
 * Middleware de Autenticação
 * 
 * Este middleware verifica se o usuário está autenticado através do token JWT.
 * 
 * @author Doc.AI Team
 */

const jwt = require('jsonwebtoken');
const { User } = require('../models');
const logger = require('../utils/logger');

/**
 * Middleware de autenticação
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Verificar se o token está presente no cabeçalho
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Acesso não autorizado. Token não fornecido.'
      });
    }

    // Extrair o token
    const token = authHeader.split(' ')[1];

    // Verificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar o usuário
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado.'
      });
    }

    // Verificar se o usuário está bloqueado
    if (user.status === 'blocked') {
      return res.status(403).json({
        success: false,
        message: 'Sua conta está bloqueada. Entre em contato com o suporte.'
      });
    }

    // Adicionar o usuário à requisição
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado. Faça login novamente.'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido. Faça login novamente.'
      });
    }

    logger.error('Erro no middleware de autenticação:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor.'
    });
  }
};

module.exports = authMiddleware;
