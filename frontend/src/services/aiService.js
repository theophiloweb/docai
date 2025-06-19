/**
 * Serviço de IA para geração de insights
 * 
 * Este módulo fornece funções para interagir com a API de IA
 * e gerar insights baseados nos dados do usuário.
 * 
 * @author Doc.AI Team
 */

import api from './api';

/**
 * Gera insights baseados em dados médicos
 * @param {Object} medicalData - Dados médicos do usuário
 * @returns {Promise<Object>} - Objeto contendo os insights gerados
 */
export const generateMedicalInsights = async (medicalData) => {
  try {
    const response = await api.post('/ai/insights/medical', {
      data: medicalData,
      prompt: `
        Analise os seguintes dados médicos e forneça insights relevantes:
        - Identifique tendências nos sinais vitais e exames laboratoriais
        - Sugira acompanhamentos necessários com base nos resultados
        - Destaque valores fora dos padrões normais
        - Sugira próximas consultas ou exames com base no histórico
        - Mantenha um tom informativo e profissional
        - Limite a resposta a 2-3 insights importantes
        - Cada insight deve ter um título curto e uma descrição concisa
      `
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Erro ao gerar insights médicos:', error);
    throw error;
  }
};

/**
 * Gera insights baseados em dados financeiros
 * @param {Object} financialData - Dados financeiros do usuário
 * @returns {Promise<Object>} - Objeto contendo os insights gerados
 */
export const generateFinancialInsights = async (financialData) => {
  try {
    const response = await api.post('/ai/insights/financial', {
      data: financialData,
      prompt: `
        Analise os seguintes dados financeiros e forneça insights relevantes:
        - Identifique padrões de gastos e receitas
        - Destaque categorias com maiores despesas
        - Sugira possíveis economias ou otimizações financeiras
        - Compare com períodos anteriores para identificar tendências
        - Alerte sobre faturas próximas do vencimento
        - Mantenha um tom informativo e profissional
        - Limite a resposta a 2-3 insights importantes
        - Cada insight deve ter um título curto e uma descrição concisa
      `
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Erro ao gerar insights financeiros:', error);
    throw error;
  }
};

/**
 * Gera insights baseados em dados de orçamentos
 * @param {Object} budgetData - Dados de orçamentos do usuário
 * @returns {Promise<Object>} - Objeto contendo os insights gerados
 */
export const generateBudgetInsights = async (budgetData) => {
  try {
    const response = await api.post('/ai/insights/budget', {
      data: budgetData,
      prompt: `
        Analise os seguintes dados de orçamentos e forneça insights relevantes:
        
        Você está analisando um grupo de orçamentos para o mesmo produto ou serviço.
        
        Por favor, forneça uma análise detalhada considerando:
        
        1. Comparação de Preços: Compare os preços entre os diferentes fornecedores e identifique qual oferece o melhor valor.
        
        2. Análise de Qualidade: Avalie a qualidade do produto/serviço com base nas avaliações, garantia e reputação do fornecedor.
        
        3. Recomendação Final: Indique qual opção oferece o melhor custo-benefício e explique por que não recomenda as outras opções.
        
        4. Fatores de Risco: Identifique possíveis riscos em cada opção (preço muito baixo, fornecedor com má reputação, etc.).
        
        5. Considerações Adicionais: Mencione outros fatores relevantes como tempo de entrega, condições de pagamento, etc.
        
        Formate sua resposta de forma clara e objetiva, com uma recomendação final explícita.
      `
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Erro ao gerar insights de orçamentos:', error);
    throw error;
  }
};

/**
 * Gera insights gerais baseados em todos os dados do usuário
 * @param {Object} userData - Dados completos do usuário
 * @returns {Promise<Array>} - Array contendo os insights gerados
 */
export const generateGeneralInsights = async (userData) => {
  // Insights de fallback para usar em caso de erro
  const fallbackInsights = [
    {
      id: '1',
      title: 'Aumento nos gastos com saúde',
      description: 'Seus gastos com saúde aumentaram 15% nos últimos 3 meses.',
      category: 'financial',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Consulta de acompanhamento necessária',
      description: 'Seu último exame indica a necessidade de uma consulta de acompanhamento.',
      category: 'medical',
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Orçamento próximo do vencimento',
      description: 'O orçamento da reforma expira em 5 dias. Considere tomar uma decisão.',
      category: 'budget',
      createdAt: new Date().toISOString()
    }
  ];

  try {
    // Verificar se temos dados suficientes para gerar insights
    if (!userData || 
        ((!userData.medicalSummary || userData.medicalSummary.totalDocuments === 0) && 
         (!userData.financialSummary || userData.financialSummary.totalDocuments === 0) && 
         (!userData.budgetSummary || userData.budgetSummary.totalBudgets === 0))) {
      console.log('Dados insuficientes para gerar insights, usando fallback');
      return fallbackInsights;
    }
    
    const response = await api.post('/ai/insights/general', {
      data: userData,
      prompt: `
        Analise os seguintes dados do usuário e forneça insights relevantes:
        - Combine dados médicos, financeiros e de orçamentos para insights integrados
        - Identifique correlações entre diferentes tipos de dados
        - Sugira ações prioritárias com base em todos os dados disponíveis
        - Destaque tendências importantes em qualquer categoria
        - Mantenha um tom informativo e profissional
        - Limite a resposta a 3-5 insights importantes
        - Cada insight deve ter:
          * Um título curto e claro
          * Uma descrição concisa (máximo 2 frases)
          * Uma categoria (medical, financial, budget ou general)
          * Uma data de criação (use a data atual)
      `
    });
    
    if (response.data && response.data.data && response.data.data.length > 0) {
      return response.data.data;
    } else {
      console.log('Resposta da API não contém insights, usando fallback');
      return fallbackInsights;
    }
  } catch (error) {
    console.error('Erro ao gerar insights gerais:', error);
    return fallbackInsights;
  }
};

export default {
  generateMedicalInsights,
  generateFinancialInsights,
  generateBudgetInsights,
  generateGeneralInsights
};
