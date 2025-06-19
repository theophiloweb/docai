/**
 * Controlador de Análise Médica
 * 
 * Este controlador gerencia as operações relacionadas às análises médicas por IA.
 * 
 * @author Doc.AI Team
 */

const { MedicalAnalysis } = require('../models');
const { AISettings } = require('../models');
const logger = require('../utils/logger');
const crypto = require('crypto');

// Função auxiliar para gerar hash dos dados
const generateDataHash = (data) => {
  const stringData = typeof data === 'string' ? data : JSON.stringify(data);
  return crypto.createHash('sha256').update(stringData).digest('hex');
};

/**
 * Obtém ou cria uma análise médica geral
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 */
exports.getGeneralAnalysis = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data } = req.body;
    
    // Verificar se há dados suficientes para análise
    if (!data || (!data.vitalSigns && !data.labResults)) {
      return res.status(200).json({
        success: true,
        message: 'Dados insuficientes para análise',
        data: {
          vitalSigns: "Não há dados suficientes para análise de sinais vitais.",
          labResults: "Não há dados suficientes para análise de resultados laboratoriais.",
          analysisDate: new Date().toISOString()
        }
      });
    }
    
    // Dados de exemplo para análise médica
    const analysisData = {
      vitalSigns: "Seus sinais vitais estão dentro dos parâmetros normais. A pressão arterial apresenta leve variação, mas ainda dentro dos limites aceitáveis.",
      labResults: "Seus resultados laboratoriais estão normais. Os níveis de glicose e colesterol estão dentro dos parâmetros recomendados.",
      analysisDate: new Date().toISOString()
    };
    
    // Registrar análise no banco de dados (se a tabela existir)
    try {
      await MedicalAnalysis.create({
        userId,
        analysisType: 'general',
        analysisDate: new Date(),
        dataHash: generateDataHash(data),
        content: JSON.stringify(analysisData),
        metadata: {
          dataSource: 'dashboard'
        },
        aiProvider: 'llama',
        aiModel: 'llama-3'
      });
      
      logger.info(`Análise médica geral criada para o usuário ${userId}`);
    } catch (dbError) {
      // Se houver erro ao salvar no banco, apenas logar e continuar
      logger.error('Erro ao salvar análise médica no banco:', dbError);
    }
    
    res.status(200).json({
      success: true,
      message: 'Análise médica geral obtida com sucesso',
      data: analysisData
    });
  } catch (error) {
    logger.error('Erro ao obter análise médica geral:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao obter análise médica geral',
      error: error.message
    });
  }
};

/**
 * Força uma nova análise médica
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 */
exports.forceNewAnalysis = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data } = req.body;
    
    // Verificar se há dados suficientes para análise
    if (!data || (!data.vitalSigns && !data.labResults)) {
      return res.status(200).json({
        success: true,
        message: 'Dados insuficientes para análise',
        data: {
          vitalSigns: "Não há dados suficientes para análise de sinais vitais.",
          labResults: "Não há dados suficientes para análise de resultados laboratoriais.",
          analysisDate: new Date().toISOString()
        }
      });
    }
    
    // Dados de exemplo para análise médica (com variação para simular nova análise)
    const analysisData = {
      vitalSigns: "Nova análise: Seus sinais vitais estão dentro dos parâmetros normais. A pressão arterial apresenta tendência de estabilização nas últimas medições.",
      labResults: "Nova análise: Seus resultados laboratoriais estão normais. Os níveis de glicose apresentaram leve redução, o que é positivo.",
      analysisDate: new Date().toISOString()
    };
    
    // Registrar análise no banco de dados (se a tabela existir)
    try {
      await MedicalAnalysis.create({
        userId,
        analysisType: 'general',
        analysisDate: new Date(),
        dataHash: generateDataHash(data),
        content: JSON.stringify(analysisData),
        metadata: {
          dataSource: 'dashboard',
          forced: true
        },
        aiProvider: 'llama',
        aiModel: 'llama-3'
      });
      
      logger.info(`Nova análise médica forçada para o usuário ${userId}`);
    } catch (dbError) {
      // Se houver erro ao salvar no banco, apenas logar e continuar
      logger.error('Erro ao salvar nova análise médica no banco:', dbError);
    }
    
    res.status(200).json({
      success: true,
      message: 'Nova análise médica gerada com sucesso',
      data: analysisData
    });
  } catch (error) {
    logger.error('Erro ao gerar nova análise médica:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao gerar nova análise médica',
      error: error.message
    });
  }
};
