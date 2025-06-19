/**
 * Serviço de OCR usando Llama OCR
 * 
 * Este serviço é responsável por extrair texto de documentos usando Llama OCR
 * e analisar o conteúdo usando Llama 4 via OpenRouter.
 * 
 * @author Doc.AI Team
 */

const fs = require('fs').promises;
const path = require('path');
const { extractText } = require('llama-ocr');
const axios = require('axios');
const logger = require('../utils/logger');
require('dotenv').config();

/**
 * Extrai texto de um arquivo usando Llama OCR
 * @param {string} filePath - Caminho do arquivo
 * @param {string} fileType - Tipo MIME do arquivo
 * @returns {Promise<string>} - Texto extraído
 */
const extractTextWithLlamaOCR = async (filePath, fileType) => {
  try {
    logger.info(`Extraindo texto com Llama OCR: ${filePath} (${fileType})`);
    
    // Configurações para o Llama OCR
    const options = {
      language: 'por', // Português
      oem: 3, // Modo de OCR (3 é o padrão)
      psm: 3, // Modo de segmentação de página (3 é o padrão)
      preprocess: true, // Pré-processar a imagem para melhorar o OCR
      timeout: 60000, // Timeout de 60 segundos
    };
    
    // Extrair texto usando Llama OCR
    const result = await extractText(filePath, options);
    
    if (!result || !result.text || result.text.trim() === '') {
      logger.warn('Llama OCR não conseguiu extrair texto');
      return '[Llama OCR não conseguiu extrair texto]';
    }
    
    logger.info(`Texto extraído com sucesso usando Llama OCR (${result.text.length} caracteres)`);
    return result.text;
  } catch (error) {
    logger.error('Erro ao extrair texto com Llama OCR:', error);
    return `[Erro ao extrair texto com Llama OCR: ${error.message}]`;
  }
};

/**
 * Analisa o texto extraído usando Llama 4 via OpenRouter
 * @param {string} text - Texto extraído
 * @param {string} documentType - Tipo de documento
 * @returns {Promise<Object>} - Resultado da análise
 */
const analyzeTextWithLlama = async (text, documentType) => {
  try {
    logger.info(`Analisando texto com Llama 4 (${text.length} caracteres)`);
    
    // Verificar se o texto é válido
    if (!text || text.length < 10 || text.startsWith('[')) {
      logger.warn('Texto insuficiente para análise');
      return {
        title: `Documento ${documentType}`,
        description: 'Não foi possível extrair texto suficiente para análise',
        documentDate: new Date(),
        error: text.startsWith('[') ? text : 'Texto insuficiente'
      };
    }
    
    // Obter configurações da API
    const apiKey = process.env.AI_API_KEY;
    const apiUrl = process.env.AI_API_URL || 'https://openrouter.ai/api/v1';
    const model = process.env.AI_MODEL || 'meta-llama/llama-4-maverick:free';
    
    // Verificar se a chave de API está configurada
    if (!apiKey) {
      logger.error('Chave de API não configurada');
      return {
        title: `Documento ${documentType}`,
        description: 'A integração com IA não está configurada corretamente',
        documentDate: new Date(),
        error: 'Chave de API não configurada'
      };
    }
    
    // Criar prompt com base no tipo de documento
    let prompt;
    switch (documentType) {
      case 'medical':
        prompt = `
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
        break;
      case 'financial':
        prompt = `
          Você é um assistente especializado em análise de documentos financeiros.
          
          Analise o seguinte documento financeiro e extraia as informações estruturadas:
          
          1. Tipo de documento (nota fiscal, recibo, fatura, etc.)
          2. Data do documento (no formato YYYY-MM-DD)
          3. Emissor/fornecedor
          4. Valor total
          5. Data de vencimento (se aplicável, no formato YYYY-MM-DD)
          6. Categoria (se possível identificar)
          7. Itens ou serviços listados (se houver)
          
          Retorne apenas um objeto JSON com essas informações, sem explicações adicionais.
          Se alguma informação não estiver disponível, use null para o valor.
          
          Documento:
          ${text}
        `;
        break;
      case 'budget':
        prompt = `
          Você é um assistente especializado em análise de orçamentos.
          
          Analise o seguinte orçamento e extraia as informações estruturadas:
          
          1. Título ou descrição do orçamento
          2. Fornecedor
          3. Data do orçamento (no formato YYYY-MM-DD)
          4. Validade (no formato YYYY-MM-DD)
          5. Valor total
          6. Categoria (tecnologia, eletrodoméstico, móveis, veículos, outros)
          7. Itens ou serviços listados (se houver)
          8. Condições de pagamento
          9. Prazo de entrega
          
          Retorne apenas um objeto JSON com essas informações, sem explicações adicionais.
          Se alguma informação não estiver disponível, use null para o valor.
          
          Documento:
          ${text}
        `;
        break;
      default:
        prompt = `
          Você é um assistente especializado em análise de documentos.
          
          Analise o seguinte documento e extraia as informações estruturadas:
          
          1. Título ou assunto principal
          2. Descrição resumida (máximo 100 caracteres)
          3. Data do documento (no formato YYYY-MM-DD, se disponível)
          4. Tipo de documento (se possível identificar)
          5. Pessoas ou entidades mencionadas
          
          Retorne apenas um objeto JSON com essas informações, sem explicações adicionais.
          Se alguma informação não estiver disponível, use null para o valor.
          
          Documento:
          ${text}
        `;
    }
    
    // Chamar a API do OpenRouter
    const response = await axios.post(`${apiUrl}/chat/completions`, {
      model: model,
      messages: [
        { role: "system", content: "Você é um assistente especializado em análise de documentos." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2, // Temperatura baixa para respostas mais precisas
      max_tokens: 1000
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://docai.com.br',
        'X-Title': 'Doc.AI'
      }
    });
    
    // Extrair resposta
    const aiResponse = response.data.choices[0].message.content;
    
    // Tentar fazer parse do JSON da resposta
    try {
      // Encontrar o primeiro objeto JSON na resposta
      const jsonMatch = aiResponse.match(/\{.*\}/s);
      if (jsonMatch) {
        const parsedData = JSON.parse(jsonMatch[0]);
        return {
          ...parsedData,
          title: parsedData.title || `Documento ${documentType}`,
          description: parsedData.description || `Documento ${documentType} processado`,
          documentDate: parsedData.documentDate || parsedData.date || new Date(),
          rawText: text
        };
      }
      
      // Se não encontrar um objeto JSON, tentar fazer parse da resposta completa
      const parsedData = JSON.parse(aiResponse);
      return {
        ...parsedData,
        title: parsedData.title || `Documento ${documentType}`,
        description: parsedData.description || `Documento ${documentType} processado`,
        documentDate: parsedData.documentDate || parsedData.date || new Date(),
        rawText: text
      };
    } catch (parseError) {
      logger.error('Erro ao fazer parse da resposta da IA:', parseError);
      
      // Retornar objeto com texto bruto
      return {
        title: `Documento ${documentType}`,
        description: 'Não foi possível analisar o documento',
        documentDate: new Date(),
        rawText: text,
        aiResponse: aiResponse
      };
    }
  } catch (error) {
    logger.error('Erro ao analisar texto com Llama 4:', error);
    return {
      title: `Documento ${documentType}`,
      description: `Erro ao analisar documento: ${error.message}`,
      documentDate: new Date(),
      rawText: text,
      error: error.message
    };
  }
};

module.exports = {
  extractTextWithLlamaOCR,
  analyzeTextWithLlama
};
