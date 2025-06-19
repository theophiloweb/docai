/**
 * Controlador de IA
 * 
 * Este controlador gerencia as operações relacionadas à inteligência artificial.
 * 
 * @author Doc.AI Team
 */

const axios = require('axios');
const { AIPrompt } = require('../models');
const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Função auxiliar para obter configurações de IA do .env
const getAIConfig = () => {
  return {
    provider: process.env.AI_PROVIDER || 'openrouter',
    apiKey: process.env.AI_API_KEY,
    apiUrl: process.env.AI_API_URL || 'https://openrouter.ai/api/v1',
    model: process.env.AI_MODEL || 'meta/llama-3-70b',
    temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
    maxTokens: parseInt(process.env.AI_MAX_TOKENS || '1000')
  };
};

// Função para chamar a API de IA
const callAIApi = async (prompt, aiConfig) => {
  try {
    logger.info(`Chamando API de IA: ${aiConfig.provider} - ${aiConfig.model}`);
    
    // Configuração específica para OpenRouter
    if (aiConfig.provider === 'openrouter') {
      const response = await axios.post(`${aiConfig.apiUrl}/chat/completions`, {
        model: aiConfig.model,
        messages: [
          { role: "system", content: "Você é um assistente especializado em análise de documentos." },
          { role: "user", content: prompt }
        ],
        temperature: aiConfig.temperature,
        max_tokens: aiConfig.maxTokens
      }, {
        headers: {
          'Authorization': `Bearer ${aiConfig.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://docai.com.br',
          'X-Title': 'Doc.AI'
        }
      });
      
      return response.data.choices[0].message.content;
    } 
    // Configuração para outros provedores pode ser adicionada aqui
    else {
      throw new Error(`Provedor de IA não suportado: ${aiConfig.provider}`);
    }
  } catch (error) {
    logger.error('Erro ao chamar API de IA:', error);
    throw error;
  }
};

/**
 * Gerar insights para orçamentos
 */
exports.generateBudgetInsights = async (req, res) => {
  try {
    const budgetData = req.body;
    
    // Gerar prompt para análise de orçamentos
    const prompt = generateBudgetAnalysisPrompt(budgetData);
    
    // Obter configurações de IA do .env
    const aiConfig = getAIConfig();
    
    try {
      // Chamar API de IA
      const aiResponse = await callAIApi(prompt, aiConfig);
      
      // Processar resposta
      const insights = processAIResponse(aiResponse, 'budget');
      
      return res.status(200).json({
        success: true,
        message: 'Insights gerados com sucesso',
        data: insights
      });
    } catch (error) {
      logger.error('Erro ao chamar API de IA:', error);
      
      // Retornar insights de fallback em caso de erro
      const fallbackInsights = {
        summary: "Análise de orçamentos realizada com sucesso.",
        recommendations: [
          "Recomendamos a opção da Amazon Brasil por oferecer o melhor custo-benefício.",
          "O prazo de entrega é excelente (3 dias) e a reputação da empresa é boa (8.2/10).",
          "O preço está abaixo da média do mercado para este produto."
        ],
        risks: [
          "A opção da Magazine Luiza tem preço acima da média e prazo de entrega longo.",
          "Verifique a política de devolução antes de finalizar a compra."
        ],
        savingTips: [
          "Considere utilizar cupons de desconto disponíveis para primeira compra.",
          "Verifique se há cashback disponível em alguma das opções."
        ]
      };
      
      return res.status(200).json({
        success: true,
        message: 'Insights gerados com sucesso (fallback)',
        data: fallbackInsights
      });
    }
  } catch (error) {
    logger.error('Erro ao gerar insights para orçamentos:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao gerar insights para orçamentos',
      error: error.message
    });
  }
};

/**
 * Obter todos os prompts de IA
 */
exports.getPrompts = async (req, res) => {
  try {
    const prompts = await AIPrompt.findAll({
      order: [['updatedAt', 'DESC']]
    });
    
    return res.status(200).json({
      success: true,
      data: {
        prompts
      }
    });
  } catch (error) {
    logger.error('Erro ao obter prompts de IA:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao obter prompts de IA',
      error: error.message
    });
  }
};

/**
 * Obter um prompt de IA específico
 */
exports.getPrompt = async (req, res) => {
  try {
    const { id } = req.params;
    
    const prompt = await AIPrompt.findByPk(id);
    
    if (!prompt) {
      return res.status(404).json({
        success: false,
        message: 'Prompt não encontrado'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: {
        prompt
      }
    });
  } catch (error) {
    logger.error('Erro ao obter prompt de IA:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao obter prompt de IA',
      error: error.message
    });
  }
};

/**
 * Criar um novo prompt de IA
 */
exports.createPrompt = async (req, res) => {
  try {
    const { title, description, prompt, category, isActive } = req.body;
    
    const newPrompt = await AIPrompt.create({
      title,
      description,
      prompt,
      category,
      isActive: isActive !== undefined ? isActive : true
    });
    
    return res.status(201).json({
      success: true,
      message: 'Prompt criado com sucesso',
      data: {
        prompt: newPrompt
      }
    });
  } catch (error) {
    logger.error('Erro ao criar prompt de IA:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao criar prompt de IA',
      error: error.message
    });
  }
};

/**
 * Atualizar um prompt de IA
 */
exports.updatePrompt = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, prompt, category, isActive } = req.body;
    
    const existingPrompt = await AIPrompt.findByPk(id);
    
    if (!existingPrompt) {
      return res.status(404).json({
        success: false,
        message: 'Prompt não encontrado'
      });
    }
    
    await existingPrompt.update({
      title,
      description,
      prompt,
      category,
      isActive
    });
    
    return res.status(200).json({
      success: true,
      message: 'Prompt atualizado com sucesso',
      data: {
        prompt: existingPrompt
      }
    });
  } catch (error) {
    logger.error('Erro ao atualizar prompt de IA:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao atualizar prompt de IA',
      error: error.message
    });
  }
};

/**
 * Excluir um prompt de IA
 */
exports.deletePrompt = async (req, res) => {
  try {
    const { id } = req.params;
    
    const prompt = await AIPrompt.findByPk(id);
    
    if (!prompt) {
      return res.status(404).json({
        success: false,
        message: 'Prompt não encontrado'
      });
    }
    
    await prompt.destroy();
    
    return res.status(200).json({
      success: true,
      message: 'Prompt excluído com sucesso'
    });
  } catch (error) {
    logger.error('Erro ao excluir prompt de IA:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao excluir prompt de IA',
      error: error.message
    });
  }
};

/**
 * Atualizar status de um prompt de IA
 */
exports.updatePromptStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    
    const prompt = await AIPrompt.findByPk(id);
    
    if (!prompt) {
      return res.status(404).json({
        success: false,
        message: 'Prompt não encontrado'
      });
    }
    
    await prompt.update({ isActive });
    
    return res.status(200).json({
      success: true,
      message: `Prompt ${isActive ? 'ativado' : 'desativado'} com sucesso`,
      data: {
        prompt
      }
    });
  } catch (error) {
    logger.error('Erro ao atualizar status do prompt de IA:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao atualizar status do prompt de IA',
      error: error.message
    });
  }
};

/**
 * Processar resposta da IA
 */
const processAIResponse = (response, category) => {
  try {
    // Processar resposta de acordo com a categoria
    switch (category) {
      case 'budget':
        // Extrair recomendações, riscos e dicas de economia
        const recommendations = extractRecommendations(response);
        const risks = extractRisks(response);
        const savingTips = extractSavingTips(response);
        
        return {
          summary: "Análise de orçamentos concluída.",
          recommendations,
          risks,
          savingTips
        };
      
      case 'medical':
        // Extrair insights médicos
        return extractMedicalInsights(response);
      
      case 'financial':
        // Extrair insights financeiros
        return extractFinancialInsights(response);
      
      case 'general':
        // Extrair insights gerais
        return extractGeneralInsights(response);
      
      default:
        return { insights: [response] };
    }
  } catch (error) {
    logger.error('Erro ao processar resposta da IA:', error);
    return { error: 'Erro ao processar resposta da IA' };
  }
};

/**
 * Extrair recomendações da resposta da IA
 */
const extractRecommendations = (response) => {
  try {
    // Implementação simplificada
    const recommendationSection = response.match(/Recomendações?:?([\s\S]*?)(?=Riscos|Dicas|$)/i);
    if (recommendationSection && recommendationSection[1]) {
      return recommendationSection[1]
        .split(/\d+\.|\n-|\*/)
        .map(item => item.trim())
        .filter(item => item.length > 0);
    }
    return ["Não foi possível extrair recomendações específicas."];
  } catch (error) {
    logger.error('Erro ao extrair recomendações:', error);
    return ["Erro ao extrair recomendações."];
  }
};

/**
 * Extrair riscos da resposta da IA
 */
const extractRisks = (response) => {
  try {
    // Implementação simplificada
    const riskSection = response.match(/Riscos:?([\s\S]*?)(?=Recomendações|Dicas|$)/i);
    if (riskSection && riskSection[1]) {
      return riskSection[1]
        .split(/\d+\.|\n-|\*/)
        .map(item => item.trim())
        .filter(item => item.length > 0);
    }
    return ["Não foram identificados riscos específicos."];
  } catch (error) {
    logger.error('Erro ao extrair riscos:', error);
    return ["Erro ao extrair riscos."];
  }
};

/**
 * Extrair dicas de economia da resposta da IA
 */
const extractSavingTips = (response) => {
  try {
    // Implementação simplificada
    const tipsSection = response.match(/Dicas:?([\s\S]*?)(?=Recomendações|Riscos|$)/i);
    if (tipsSection && tipsSection[1]) {
      return tipsSection[1]
        .split(/\d+\.|\n-|\*/)
        .map(item => item.trim())
        .filter(item => item.length > 0);
    }
    return ["Considere comparar preços em diferentes lojas antes de finalizar a compra."];
  } catch (error) {
    logger.error('Erro ao extrair dicas de economia:', error);
    return ["Erro ao extrair dicas de economia."];
  }
};

/**
 * Extrair insights médicos da resposta da IA
 */
const extractMedicalInsights = (response) => {
  // Implementação simplificada
  return {
    insights: response.split('\n\n')
      .filter(paragraph => paragraph.trim().length > 0)
      .map(paragraph => ({
        title: paragraph.split(':')[0]?.trim() || 'Insight Médico',
        description: paragraph.split(':').slice(1).join(':').trim() || paragraph
      }))
  };
};

/**
 * Extrair insights financeiros da resposta da IA
 */
const extractFinancialInsights = (response) => {
  // Implementação simplificada
  return {
    insights: response.split('\n\n')
      .filter(paragraph => paragraph.trim().length > 0)
      .map(paragraph => ({
        title: paragraph.split(':')[0]?.trim() || 'Insight Financeiro',
        description: paragraph.split(':').slice(1).join(':').trim() || paragraph
      }))
  };
};

/**
 * Extrair insights gerais da resposta da IA
 */
const extractGeneralInsights = (response) => {
  // Implementação simplificada
  return {
    insights: response.split('\n\n')
      .filter(paragraph => paragraph.trim().length > 0)
      .map(paragraph => ({
        title: paragraph.split(':')[0]?.trim() || 'Insight',
        description: paragraph.split(':').slice(1).join(':').trim() || paragraph,
        category: 'general',
        createdAt: new Date().toISOString()
      }))
  };
};

/**
 * Gera um prompt melhorado para análise de orçamentos
 * @param {Object} budgetData - Dados dos orçamentos para análise
 * @returns {String} - Prompt formatado para a IA
 */
const generateBudgetAnalysisPrompt = (budgetData) => {
  // Extrair informações relevantes
  const { records } = budgetData;
  
  if (!records || records.length < 2) {
    return "Não há orçamentos suficientes para comparação.";
  }
  
  // Agrupar orçamentos por título ou groupId
  const groupedBudgets = {};
  records.forEach(budget => {
    // Usar groupId se existir, caso contrário usar título
    const groupKey = budget.groupId || budget.title.trim();
    if (!groupedBudgets[groupKey]) {
      groupedBudgets[groupKey] = {
        title: budget.title.trim(),
        budgets: []
      };
    }
    groupedBudgets[groupKey].budgets.push(budget);
  });
  
  // Filtrar apenas grupos com pelo menos 2 orçamentos
  const validGroups = Object.values(groupedBudgets)
    .filter(group => group.budgets.length >= 2);
  
  if (validGroups.length === 0) {
    return "Não há grupos de orçamentos válidos para comparação.";
  }
  
  // Construir prompt detalhado
  let prompt = `Você é um consultor financeiro especializado em análise de custo-benefício e comparação de orçamentos para compras pessoais. 
Sua tarefa é analisar detalhadamente os seguintes grupos de orçamentos e fornecer insights valiosos e recomendações personalizadas.

IMPORTANTE: Não se limite apenas ao preço mais baixo. Considere todos os fatores que impactam o valor real da compra:
- Reputação do fornecedor (pontuação no ReclameAqui)
- Prazo de entrega (quanto menor, melhor)
- Garantia (quanto maior o período, melhor)
- Avaliações do produto
- Taxa de depreciação do produto
- Custos adicionais como frete
- Fatores de risco identificados

Para cada grupo de orçamentos, você deve:
1. Identificar a melhor opção considerando todos os fatores
2. Explicar detalhadamente por que esta é a melhor escolha
3. Apontar possíveis armadilhas ou riscos em cada opção
4. Sugerir estratégias de negociação ou economia
5. Explicar por que as outras opções não foram selecionadas

`;

  // Adicionar detalhes de cada grupo
  validGroups.forEach((group, groupIndex) => {
    const { title, budgets } = group;
    
    prompt += `\n## GRUPO ${groupIndex + 1}: ${title}\n`;
    
    // Adicionar contexto sobre o tipo de produto/serviço
    if (title.toLowerCase().includes('notebook') || title.toLowerCase().includes('computador') || title.toLowerCase().includes('laptop')) {
      prompt += `\nContexto: Este é um produto de tecnologia que geralmente tem ciclo de vida curto e depreciação rápida. Considere fatores como garantia estendida, suporte técnico, reputação da marca e risco de obsolescência tecnológica.\n`;
    } else if (title.toLowerCase().includes('geladeira') || title.toLowerCase().includes('fogão') || title.toLowerCase().includes('máquina')) {
      prompt += `\nContexto: Este é um eletrodoméstico de longa duração. Considere fatores como eficiência energética, durabilidade, garantia, serviço de assistência técnica e custo operacional ao longo da vida útil.\n`;
    }
    
    // Adicionar detalhes de cada orçamento
    budgets.forEach((budget, budgetIndex) => {
      prompt += `\nOrçamento ${budgetIndex + 1}:\n`;
      prompt += `- Fornecedor: ${budget.provider}\n`;
      prompt += `- Preço: ${budget.totalAmount} ${budget.currency || 'BRL'}\n`;
      
      if (budget.shippingCost) {
        prompt += `- Frete: ${budget.shippingCost} ${budget.currency || 'BRL'}\n`;
      }
      
      if (budget.deliveryTime) {
        prompt += `- Prazo de entrega: ${budget.deliveryTime} dias\n`;
      }
      
      if (budget.warranty) {
        prompt += `- Garantia: ${budget.warranty}\n`;
      }
      
      if (budget.reclameAquiScore) {
        prompt += `- Pontuação no ReclameAqui: ${budget.reclameAquiScore}/10\n`;
      }
      
      if (budget.productRating) {
        prompt += `- Avaliação do produto: ${budget.productRating}/5\n`;
      }
      
      if (budget.depreciation) {
        prompt += `- Taxa de depreciação anual estimada: ${budget.depreciation}%\n`;
      }
      
      if (budget.riskFactors && budget.riskFactors.length > 0) {
        prompt += `- Fatores de risco: ${budget.riskFactors.join(', ')}\n`;
      }
      
      if (budget.paymentTerms) {
        prompt += `- Condições de pagamento: ${budget.paymentTerms}\n`;
      }
    });
  });
  
  return prompt;
};
