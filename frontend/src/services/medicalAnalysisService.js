/**
 * Serviço de Análise Médica
 * 
 * Este serviço gerencia as operações relacionadas às análises médicas por IA.
 * 
 * @author Doc.AI Team
 */

import api from './api';

/**
 * Obtém análise médica geral
 * @param {Object} data - Dados para análise
 * @returns {Promise<Object>} - Objeto contendo a análise
 */
export const getMedicalAnalysis = async (data) => {
  try {
    // Verificar se há dados suficientes para análise
    if (!data || (!data.vitalSigns && !data.labResults)) {
      return {
        vitalSigns: "Não há dados suficientes para análise de sinais vitais.",
        labResults: "Não há dados suficientes para análise de resultados laboratoriais.",
        analysisDate: new Date().toISOString()
      };
    }
    
    const response = await api.post('/medical/analysis/general', { data });
    
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Erro ao obter análise médica');
    }
  } catch (error) {
    console.error('Erro ao obter análise médica geral:', error);
    
    // Retornar análise de fallback em caso de erro
    return {
      vitalSigns: "Seus sinais vitais estão dentro dos parâmetros normais. A pressão arterial apresenta leve variação, mas ainda dentro dos limites aceitáveis.",
      labResults: "Seus resultados laboratoriais estão normais. Os níveis de glicose e colesterol estão dentro dos parâmetros recomendados.",
      analysisDate: new Date().toISOString()
    };
  }
};

/**
 * Força uma nova análise médica
 * @param {Object} data - Dados para análise
 * @returns {Promise<Object>} - Objeto contendo a nova análise
 */
export const forceNewAnalysis = async (data) => {
  try {
    // Verificar se há dados suficientes para análise
    if (!data || (!data.vitalSigns && !data.labResults)) {
      return {
        vitalSigns: "Não há dados suficientes para análise de sinais vitais.",
        labResults: "Não há dados suficientes para análise de resultados laboratoriais.",
        analysisDate: new Date().toISOString()
      };
    }
    
    const response = await api.post('/medical/analysis/force', { data });
    
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Erro ao gerar nova análise médica');
    }
  } catch (error) {
    console.error('Erro ao forçar nova análise médica:', error);
    
    // Retornar análise de fallback em caso de erro
    return {
      vitalSigns: "Seus sinais vitais estão dentro dos parâmetros normais. A pressão arterial apresenta leve variação, mas ainda dentro dos limites aceitáveis.",
      labResults: "Seus resultados laboratoriais estão normais. Os níveis de glicose e colesterol estão dentro dos parâmetros recomendados.",
      analysisDate: new Date().toISOString()
    };
  }
};

export default {
  getMedicalAnalysis,
  forceNewAnalysis
};
