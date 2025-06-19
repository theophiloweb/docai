/**
 * Serviço de Análise de Documentos
 * 
 * Este serviço é responsável por analisar o texto extraído de documentos usando IA.
 * 
 * @author Doc.AI Team
 */

const axios = require('axios');
const logger = require('../utils/logger');

/**
 * Obtém configurações de IA do .env
 * @returns {Object} Configurações de IA
 */
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

/**
 * Analisa um documento médico
 * @param {string} text - Texto extraído do documento
 * @returns {Promise<Object>} - Dados estruturados extraídos
 */
const analyzeMedicalDocument = async (text) => {
  try {
    logger.info('Analisando documento médico');
    
    // Se não houver texto ou for muito curto, retornar erro
    if (!text || text.length < 10) {
      return {
        title: "Documento médico",
        description: "Não foi possível extrair texto suficiente para análise",
        documentDate: new Date(),
        rawText: text
      };
    }
    
    const aiConfig = getAIConfig();
    
    const prompt = `
      Você é um assistente especializado em análise de documentos médicos.
      
      Analise o seguinte documento médico e extraia as informações estruturadas:
      
      1. Nome do médico
      2. CRM do médico
      3. Especialidade do médico
      4. Data do documento (no formato YYYY-MM-DD)
      5. Nome do paciente
      6. Diagnóstico principal
      7. Prescrições ou recomendações
      8. Exames solicitados ou resultados de exames
      
      Retorne apenas um objeto JSON com essas informações, sem explicações adicionais.
      Se alguma informação não estiver disponível, use null para o valor.
      
      Documento:
      ${text}
    `;
    
    const response = await callAIApi(prompt, aiConfig);
    
    // Tentar fazer parse do JSON da resposta
    try {
      // Verificar se a resposta já é um objeto JSON (em caso de erro)
      if (typeof response === 'object') {
        return {
          ...response,
          title: "Documento médico",
          description: response.error || "Erro na análise do documento",
          documentDate: new Date(),
          rawText: text
        };
      }
      
      // Encontrar o primeiro objeto JSON na resposta
      const jsonMatch = response.match(/\\{.*\\}/s);
      if (jsonMatch) {
        const parsedData = JSON.parse(jsonMatch[0]);
        return {
          ...parsedData,
          title: parsedData.title || `Consulta médica ${parsedData.doctorName ? `com Dr. ${parsedData.doctorName}` : ''}`,
          description: parsedData.description || parsedData.diagnosis || "Documento médico processado",
          documentDate: parsedData.documentDate || new Date(),
          rawText: text
        };
      }
      
      // Se não encontrar um objeto JSON, tentar fazer parse da resposta completa
      const parsedData = JSON.parse(response);
      return {
        ...parsedData,
        title: parsedData.title || `Consulta médica ${parsedData.doctorName ? `com Dr. ${parsedData.doctorName}` : ''}`,
        description: parsedData.description || parsedData.diagnosis || "Documento médico processado",
        documentDate: parsedData.documentDate || new Date(),
        rawText: text
      };
    } catch (parseError) {
      logger.error('Erro ao fazer parse da resposta da IA:', parseError);
      
      // Retornar objeto com texto bruto
      return {
        title: "Documento médico",
        description: "Não foi possível analisar o documento",
        documentDate: new Date(),
        rawText: text,
        aiResponse: response
      };
    }
  } catch (error) {
    logger.error('Erro ao analisar documento médico:', error);
    return {
      title: "Documento médico",
      description: `Erro ao analisar documento: ${error.message}`,
      documentDate: new Date(),
      rawText: text,
      error: error.message
    };
  }
};

/**
 * Analisa um documento financeiro
 * @param {string} text - Texto extraído do documento
 * @returns {Promise<Object>} - Dados estruturados extraídos
 */
const analyzeFinancialDocument = async (text) => {
  try {
    logger.info('Analisando documento financeiro');
    
    const aiConfig = getAIConfig();
    
    const prompt = `
      Você é um assistente especializado em análise de documentos financeiros.
      
      Analise o seguinte documento financeiro e extraia as informações estruturadas:
      
      1. Tipo de documento (fatura, recibo, extrato, etc.)
      2. Data do documento (no formato YYYY-MM-DD)
      3. Valor total
      4. Nome do emissor/empresa
      5. Categoria (ex: moradia, transporte, alimentação, etc.)
      6. Data de vencimento, se aplicável (no formato YYYY-MM-DD)
      7. Status (pago, pendente, etc.)
      8. Itens ou transações principais (lista de objetos com descrição e valor)
      
      Retorne apenas um objeto JSON com essas informações, sem explicações adicionais.
      Se alguma informação não estiver disponível, use null para o valor.
      
      Documento:
      ${text}
    `;
    
    const response = await callAIApi(prompt, aiConfig);
    
    // Tentar fazer parse do JSON da resposta
    try {
      // Encontrar o primeiro objeto JSON na resposta
      const jsonMatch = response.match(/\\{.*\\}/s);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Se não encontrar um objeto JSON, tentar fazer parse da resposta completa
      return JSON.parse(response);
    } catch (parseError) {
      logger.error('Erro ao fazer parse da resposta da IA:', parseError);
      
      // Retornar objeto com texto bruto
      return {
        rawText: text,
        aiResponse: response
      };
    }
  } catch (error) {
    logger.error('Erro ao analisar documento financeiro:', error);
    throw error;
  }
};

/**
 * Analisa um documento de orçamento
 * @param {string} text - Texto extraído do documento
 * @returns {Promise<Object>} - Dados estruturados extraídos
 */
const analyzeBudgetDocument = async (text) => {
  try {
    logger.info('Analisando documento de orçamento');
    
    const aiConfig = getAIConfig();
    
    const prompt = `
      Você é um assistente especializado em análise de orçamentos.
      
      Analise o seguinte orçamento e extraia as informações estruturadas:
      
      1. Título ou descrição do orçamento
      2. Nome do fornecedor
      3. Data do orçamento (no formato YYYY-MM-DD)
      4. Validade do orçamento (no formato YYYY-MM-DD)
      5. Valor total
      6. Categoria do produto/serviço
      7. Itens incluídos (lista de objetos com descrição, quantidade e valor unitário)
      8. Condições de pagamento
      9. Prazo de entrega
      
      Retorne apenas um objeto JSON com essas informações, sem explicações adicionais.
      Se alguma informação não estiver disponível, use null para o valor.
      
      Documento:
      ${text}
    `;
    
    const response = await callAIApi(prompt, aiConfig);
    
    // Tentar fazer parse do JSON da resposta
    try {
      // Encontrar o primeiro objeto JSON na resposta
      const jsonMatch = response.match(/\\{.*\\}/s);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Se não encontrar um objeto JSON, tentar fazer parse da resposta completa
      return JSON.parse(response);
    } catch (parseError) {
      logger.error('Erro ao fazer parse da resposta da IA:', parseError);
      
      // Retornar objeto com texto bruto
      return {
        rawText: text,
        aiResponse: response
      };
    }
  } catch (error) {
    logger.error('Erro ao analisar documento de orçamento:', error);
    throw error;
  }
};

/**
 * Gera insights para um documento médico
 * @param {Object} data - Dados estruturados do documento
 * @returns {Promise<Object>} - Insights gerados
 */
const generateMedicalInsights = async (data) => {
  try {
    logger.info('Gerando insights para documento médico');
    
    const aiConfig = getAIConfig();
    
    const prompt = `
      Você é um assistente especializado em análise de documentos médicos.
      
      Com base nas informações extraídas do documento médico, gere insights relevantes para o paciente:
      
      1. Resumo do documento em linguagem simples
      2. Pontos importantes a serem observados
      3. Recomendações de acompanhamento
      4. Alertas, se houver informações preocupantes
      
      Dados do documento:
      ${JSON.stringify(data, null, 2)}
      
      Retorne apenas um objeto JSON com os insights, sem explicações adicionais.
    `;
    
    const response = await callAIApi(prompt, aiConfig);
    
    // Tentar fazer parse do JSON da resposta
    try {
      // Encontrar o primeiro objeto JSON na resposta
      const jsonMatch = response.match(/\\{.*\\}/s);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Se não encontrar um objeto JSON, tentar fazer parse da resposta completa
      return JSON.parse(response);
    } catch (parseError) {
      logger.error('Erro ao fazer parse da resposta da IA:', parseError);
      
      // Retornar objeto com texto bruto
      return {
        insights: response
      };
    }
  } catch (error) {
    logger.error('Erro ao gerar insights para documento médico:', error);
    throw error;
  }
};

/**
 * Chama a API de IA
 * @param {string} prompt - Prompt para a IA
 * @param {Object} aiConfig - Configurações da IA
 * @returns {Promise<string>} - Resposta da IA
 */
const callAIApi = async (prompt, aiConfig) => {
  try {
    logger.info(`Chamando API de IA: ${aiConfig.provider} - ${aiConfig.model}`);
    
    // Verificar se a chave de API está configurada
    if (!aiConfig.apiKey) {
      logger.error('Chave de API não configurada');
      return JSON.stringify({
        error: "Chave de API não configurada",
        message: "A integração com IA não está configurada corretamente."
      });
    }
    
    // Configuração específica para OpenRouter
    if (aiConfig.provider === 'openrouter') {
      try {
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
      } catch (apiError) {
        logger.error('Erro na chamada à API OpenRouter:', apiError);
        return JSON.stringify({
          error: "Erro na chamada à API",
          message: apiError.message || "Falha na comunicação com a API de IA"
        });
      }
    } 
    // Configuração para outros provedores pode ser adicionada aqui
    else {
      return JSON.stringify({
        error: "Provedor não suportado",
        message: `Provedor de IA não suportado: ${aiConfig.provider}`
      });
    }
  } catch (error) {
    logger.error('Erro ao chamar API de IA:', error);
    return JSON.stringify({
      error: "Erro interno",
      message: error.message || "Ocorreu um erro ao processar a solicitação"
    });
  }
};

module.exports = {
  analyzeMedicalDocument,
  analyzeFinancialDocument,
  analyzeBudgetDocument,
  generateMedicalInsights
};
