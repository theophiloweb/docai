/**
 * Serviço de geração de insights para documentos
 * 
 * Este serviço é responsável por gerar insights a partir do texto extraído de documentos
 * usando modelos de IA configurados no .env e prompts do banco de dados.
 * 
 * @author Doc.AI Team
 */

const axios = require('axios');
const logger = require('../utils/logger');
const { AIPrompt } = require('../models');
require('dotenv').config();

/**
 * Gera insights para um documento com base no texto extraído usando apenas IA
 * @param {string} extractedText - Texto extraído do documento
 * @param {string} documentType - Tipo de documento
 * @returns {Promise<Object>} - Insights gerados pela IA
 */
const generateInsights = async (extractedText, documentType) => {
  try {
    // Obter configurações da API do .env
    const apiKey = process.env.AI_API_KEY;
    const apiUrl = process.env.AI_API_URL || 'https://openrouter.ai/api/v1';
    const model = process.env.AI_MODEL || 'meta-llama/llama-4-maverick:free';
    
    // Verificar se o texto é válido
    if (!extractedText || extractedText.length < 10 || extractedText.startsWith('[')) {
      logger.warn('Texto insuficiente para gerar insights');
      return {
        summary: 'Não foi possível gerar insights devido a texto insuficiente.',
        pointsOfAttention: 'O texto extraído do documento é muito curto ou não contém informações suficientes.'
      };
    }
    
    // Verificar se a chave de API está configurada
    if (!apiKey) {
      logger.error('Chave de API não configurada para geração de insights');
      return {
        summary: 'Não foi possível gerar insights (chave de API não configurada).',
        pointsOfAttention: 'Entre em contato com o administrador do sistema para configurar a integração com IA.'
      };
    }
    
    // Limitar o texto para análise
    const maxTextLength = 5000;
    const truncatedText = extractedText.length > maxTextLength 
      ? extractedText.substring(0, maxTextLength) + '...' 
      : extractedText;
    
    // Buscar prompt do banco de dados
    const prompt = await getPromptFromDatabase(documentType, truncatedText);
    
    // Chamar a API de IA
    try {
      logger.info(`Chamando API de IA para gerar insights (${apiUrl}, modelo: ${model})`);
      
      const response = await axios.post(`${apiUrl}/chat/completions`, {
        model: model,
        messages: [
          { role: "system", content: "Você é um assistente especializado em análise de documentos. IMPORTANTE: Responda APENAS com um objeto JSON válido e completo. Não use markdown, não adicione explicações. Comece sua resposta com { e termine com }." },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 3000
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://docai.com.br',
          'X-Title': 'Doc.AI'
        },
        timeout: 120000
      });
      
      // Extrair resposta
      const aiResponse = response.data.choices[0].message.content;
      logger.info('Resposta da IA recebida com sucesso');
      logger.debug('Resposta completa da IA:', aiResponse);
      logger.debug('Tamanho da resposta:', aiResponse.length);
      
      // Tentar fazer parse do JSON da resposta
      try {
        // Limpar a resposta removendo markdown e texto extra
        let cleanResponse = aiResponse.trim();
        
        // Remover blocos de código markdown se existirem
        cleanResponse = cleanResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '');
        
        // Tentar parse direto primeiro
        try {
          const parsedData = JSON.parse(cleanResponse);
          logger.info('JSON extraído com sucesso da resposta completa da IA');
          return parsedData;
        } catch (directParseError) {
          // Se falhar, procurar por JSON na resposta
          const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsedData = JSON.parse(jsonMatch[0]);
            logger.info('JSON extraído com sucesso da resposta da IA');
            return parsedData;
          }
        }
        
        throw new Error('Nenhum JSON válido encontrado na resposta');
      } catch (parseError) {
        logger.error('Erro ao fazer parse da resposta da IA para insights:', parseError);
        logger.debug('Resposta da IA que falhou no parse:', aiResponse);
        
        // Se a resposta foi cortada, tentar novamente com menos tokens
        if (aiResponse.length > 2500) {
          logger.warn('Resposta da IA parece ter sido cortada, tentando novamente...');
          
          try {
            const retryResponse = await axios.post(`${apiUrl}/chat/completions`, {
              model: model,
              messages: [
                { role: "system", content: "Você é um assistente especializado em análise de documentos. Responda APENAS com um objeto JSON válido e completo, sem texto adicional." },
                { role: "user", content: `${prompt}\n\nIMPORTANTE: Sua resposta deve ser um JSON completo e válido. Se necessário, seja mais conciso mas mantenha as informações essenciais.` }
              ],
              temperature: 0.3,
              max_tokens: 2000
            }, {
              headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://docai.com.br',
                'X-Title': 'Doc.AI'
              },
              timeout: 120000
            });
            
            const retryAiResponse = retryResponse.data.choices[0].message.content;
            let cleanRetryResponse = retryAiResponse.trim().replace(/```json\s*/g, '').replace(/```\s*/g, '');
            
            try {
              const parsedRetryData = JSON.parse(cleanRetryResponse);
              logger.info('JSON extraído com sucesso na segunda tentativa');
              return parsedRetryData;
            } catch (retryParseError) {
              logger.warn('Segunda tentativa também falhou no parse');
            }
          } catch (retryError) {
            logger.warn('Erro na segunda tentativa:', retryError.message);
          }
        }
        
        // Tentar extrair informações úteis mesmo sem JSON válido
        const summaryMatch = aiResponse.match(/"summary":\s*"([^"]+)"/);
        const pointsMatch = aiResponse.match(/"pointsOfAttention":\s*(\[[^\]]+\]|"[^"]+"|[^,}]+)/);
        
        let summary = "Não foi possível processar completamente a resposta da IA.";
        let pointsOfAttention = "Recomendamos revisar o documento manualmente.";
        
        if (summaryMatch) {
          summary = summaryMatch[1];
        } else if (aiResponse.length > 0) {
          // Usar parte da resposta como resumo
          summary = aiResponse.substring(0, 500).replace(/[{}"\[\]]/g, '');
        }
        
        if (pointsMatch) {
          try {
            pointsOfAttention = JSON.parse(pointsMatch[1]);
          } catch {
            pointsOfAttention = pointsMatch[1].replace(/"/g, '');
          }
        }
        
        return {
          summary,
          pointsOfAttention
        };
      }
    } catch (apiError) {
      logger.error('Erro ao chamar API de IA para insights:', apiError);
      return {
        summary: "Ocorreu um erro ao analisar o documento.",
        pointsOfAttention: "Recomendamos revisar o documento manualmente."
      };
    }
  } catch (error) {
    logger.error('Erro ao gerar insights:', error);
    return {
      summary: "Ocorreu um erro ao analisar o documento.",
      pointsOfAttention: "Recomendamos revisar o documento manualmente."
    };
  }
};

/**
 * Busca o prompt do banco de dados baseado no tipo de documento
 * @param {string} documentType - Tipo de documento
 * @param {string} truncatedText - Texto truncado do documento
 * @returns {Promise<string>} - Prompt para a IA
 */
async function getPromptFromDatabase(documentType, truncatedText) {
  try {
    // Buscar o prompt ativo mais recente para a categoria especificada
    const promptRecord = await AIPrompt.findOne({
      where: {
        category: documentType,
        isActive: true
      },
      order: [['updatedAt', 'DESC']]
    });
    
    if (promptRecord) {
      logger.info(`Prompt recuperado do banco de dados para categoria: ${documentType}`);
      // Substituir variável no prompt se existir e adicionar instrução JSON
      const basePrompt = promptRecord.prompt.includes('${truncatedText}') 
        ? promptRecord.prompt.replace('${truncatedText}', truncatedText)
        : `${promptRecord.prompt}\n\nTexto extraído do documento:\n${truncatedText}`;
      
      return `${basePrompt}\n\nIMPORTANTE: Responda APENAS com um objeto JSON válido e completo. Não adicione explicações, markdown ou texto extra. Sua resposta deve começar com { e terminar com }.`;
    }
    
    // Se não encontrou no banco, usar prompt padrão
    logger.warn(`Prompt não encontrado no banco para categoria: ${documentType}, usando padrão`);
    return getPromptForDocumentType(documentType, truncatedText);
  } catch (error) {
    logger.error(`Erro ao buscar prompt do banco: ${error.message}`);
    return getPromptForDocumentType(documentType, truncatedText);
  }
}

/**
 * Retorna o prompt padrão para o tipo de documento (fallback)
 * @param {string} documentType - Tipo de documento
 * @param {string} truncatedText - Texto truncado do documento
 * @returns {string} - Prompt para a IA
 */
function getPromptForDocumentType(documentType, truncatedText) {
  switch (documentType) {
    case 'medical':
      return `
        Você é um assistente médico especializado em análise de documentos de saúde.
        
        Analise minuciosamente o texto extraído de um laudo/documento médico e forneça:
        
        1. Resumo clínico: Elabore um resumo MUITO DETALHADO (6-10 frases) que capture a essência do documento, incluindo:
           - Diagnósticos principais mencionados
           - Procedimentos realizados ou recomendados
           - Condições médicas identificadas
           - Resultados relevantes de exames
           - Contexto médico importante
           - Histórico médico relevante
           - Medicações prescritas
           - Recomendações médicas
        
        2. Pontos de atenção: Identifique 5-8 informações críticas que merecem atenção especial, como:
           - Valores anormais em exames
           - Restrições ou recomendações médicas importantes
           - Medicações prescritas e suas dosagens
           - Datas de acompanhamento ou retorno
           - Possíveis implicações dos diagnósticos mencionados
           - Alergias ou contraindicações
           - Sintomas importantes
           - Limitações físicas ou restrições
        
        Utilize seu conhecimento médico para contextualizar as informações encontradas no documento.
        Não se limite apenas ao que está explicitamente escrito - interprete os dados médicos com base em conhecimento científico.
        Evite linguagem alarmista ou preocupante - mantenha um tom informativo e profissional.
        
        IMPORTANTE: Forneça um resumo MUITO DETALHADO e COMPLETO, não apenas algumas frases curtas.
        
        Retorne APENAS um objeto JSON válido com os campos "summary" e "pointsOfAttention", sem explicações adicionais ou formatação markdown.
        
        Texto extraído do documento médico:
        ${truncatedText}
      `;
    case 'financial':
      return `
        Você é um analista financeiro especializado em análise de documentos financeiros.
        
        Analise minuciosamente o texto extraído de um documento financeiro e forneça:
        
        1. Resumo financeiro: Elabore um resumo detalhado (4-6 frases) que capture a essência do documento, incluindo:
           - Tipo de transação ou operação financeira
           - Valores principais e sua contextualização
           - Partes envolvidas (emitente, destinatário)
           - Período ou data de referência
           - Implicações financeiras principais
        
        2. Pontos de atenção: Identifique 3-5 informações críticas que merecem atenção especial, como:
           - Datas de vencimento ou prazos importantes
           - Taxas, juros ou multas aplicáveis
           - Condições especiais mencionadas
           - Valores que se destacam (muito altos ou baixos)
           - Obrigações financeiras ou fiscais relevantes
        
        Utilize seu conhecimento financeiro para contextualizar as informações encontradas.
        Não se limite apenas ao que está explicitamente escrito - interprete os dados financeiros com base em conhecimento especializado.
        Evite linguagem alarmista - mantenha um tom informativo e profissional.
        
        Retorne APENAS um objeto JSON válido com os campos "summary" e "pointsOfAttention", sem explicações adicionais ou formatação markdown.
        
        Texto extraído do documento financeiro:
        ${truncatedText}
      `;
    case 'budget':
      return `
        Você é um analista especializado em avaliação de orçamentos e propostas comerciais.
        
        Analise minuciosamente o texto extraído de um orçamento e forneça:
        
        1. Resumo do orçamento: Elabore um resumo detalhado (4-6 frases) que capture a essência do documento, incluindo:
           - Produto ou serviço orçado
           - Fornecedor e suas credenciais
           - Valor total e condições de pagamento
           - Prazo de entrega ou execução
           - Diferenciais ou características especiais da proposta
        
        2. Pontos de atenção: Identifique 3-5 informações críticas que merecem atenção especial, como:
           - Prazo de validade do orçamento
           - Garantias oferecidas
           - Condições especiais (frete, instalação, suporte)
           - Itens inclusos e exclusos
           - Comparação implícita com valores de mercado
        
        Utilize seu conhecimento comercial para contextualizar as informações encontradas.
        Não se limite apenas ao que está explicitamente escrito - interprete os dados com base em conhecimento especializado sobre o mercado.
        Evite linguagem tendenciosa - mantenha um tom informativo e profissional.
        
        Retorne APENAS um objeto JSON válido com os campos "summary" e "pointsOfAttention", sem explicações adicionais ou formatação markdown.
        
        Texto extraído do orçamento:
        ${truncatedText}
      `;
    default:
      return `
        Você é um analista especializado em extração de informações e análise de documentos.
        
        Analise minuciosamente o texto extraído do documento e forneça:
        
        1. Resumo: Elabore um resumo detalhado (4-6 frases) que capture a essência do documento, incluindo:
           - Assunto principal do documento
           - Contexto e propósito
           - Informações principais apresentadas
           - Conclusões ou resultados relevantes
           - Implicações importantes do conteúdo
        
        2. Pontos de atenção: Identifique 3-5 informações críticas que merecem atenção especial, como:
           - Datas importantes mencionadas
           - Pessoas ou entidades relevantes
           - Valores ou quantidades significativas
           - Requisitos ou obrigações mencionados
           - Informações que se destacam pelo contexto
        
        Utilize seu conhecimento especializado para contextualizar as informações encontradas.
        Não se limite apenas ao que está explicitamente escrito - interprete os dados com base em conhecimento relevante.
        Realize tarefas de limpeza, normalização, análise de sentimento e extração de informações para enriquecer sua análise.
        Evite linguagem tendenciosa - mantenha um tom informativo e profissional.
        
        Retorne APENAS um objeto JSON válido com os campos "summary" e "pointsOfAttention", sem explicações adicionais ou formatação markdown.
        
        Texto extraído do documento:
        ${truncatedText}
      `;
  }
}

module.exports = {
  generateInsights
};
