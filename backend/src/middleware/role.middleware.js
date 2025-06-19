/**
 * Middleware de verificação de papel (role)
 * 
 * Este middleware verifica se o usuário tem o papel necessário para acessar uma rota.
 * 
 * @author Doc.AI Team
 */

/**
 * Middleware para verificar o papel do usuário
 * @param {Array} roles - Array de papéis permitidos
 * @returns {Function} Middleware Express
 */
module.exports = (roles) => {
  return (req, res, next) => {
    // Verificar se o usuário existe na requisição (adicionado pelo middleware de autenticação)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Não autorizado'
      });
    }

    // Verificar se o papel do usuário está na lista de papéis permitidos
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado'
      });
    }

    // Se o usuário tem o papel necessário, continuar
    next();
  };
};
