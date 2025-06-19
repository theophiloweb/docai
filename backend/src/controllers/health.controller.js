/**
 * Controlador de Saúde do Sistema
 * 
 * Este controlador gerencia as operações relacionadas à verificação de saúde do sistema.
 * 
 * @author Doc.AI Team
 */

const { sequelize } = require('../config/database');
const logger = require('../utils/logger');

/**
 * Verifica a saúde do sistema
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 */
exports.checkHealth = async (req, res) => {
  try {
    // Verificar conexão com o banco de dados
    await sequelize.authenticate();
    
    res.status(200).json({
      success: true,
      message: 'Servidor funcionando corretamente',
      timestamp: new Date(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    logger.error('Erro ao verificar saúde do sistema:', error);
    
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar saúde do sistema',
      error: error.message,
      timestamp: new Date(),
      environment: process.env.NODE_ENV || 'development'
    });
  }
};
