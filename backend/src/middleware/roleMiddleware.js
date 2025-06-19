/**
 * Middleware de Verificação de Papel
 * 
 * Este middleware verifica se o usuário tem o papel necessário para acessar um recurso.
 * 
 * @author Doc.AI Team
 */

const logger = require('../utils/logger');

/**
 * Middleware para verificar o papel do usuário
 * 
 * @param {string|string[]} roles - Papel ou papéis permitidos
 * @returns {Function} Middleware do Express
 */
const roleMiddleware = (roles) => {
  return (req, res, next) => {
    try {
      // Verificar se o usuário está na requisição (authMiddleware deve ser executado antes)
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Acesso não autorizado. Usuário não autenticado.'
        });
      }

      // Converter para array se for uma string
      const allowedRoles = Array.isArray(roles) ? roles : [roles];

      // Verificar se o papel do usuário está na lista de papéis permitidos
      if (!allowedRoles.includes(req.user.role)) {
        logger.warn(`Tentativa de acesso não autorizado: usuário ${req.user.email} (${req.user.role}) tentou acessar recurso restrito a ${allowedRoles.join(', ')}`);
        
        return res.status(403).json({
          success: false,
          message: 'Acesso proibido. Você não tem permissão para acessar este recurso.'
        });
      }

      next();
    } catch (error) {
      logger.error('Erro no middleware de verificação de papel:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor.'
      });
    }
  };
};

module.exports = roleMiddleware;
