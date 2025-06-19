/**
 * Serviço para interagir com a API do OpenRouter
 * 
 * Este módulo fornece funções para obter informações sobre modelos disponíveis no OpenRouter.
 * 
 * @author Doc.AI Team
 */

import axios from 'axios';

/**
 * Obtém a lista de modelos disponíveis no OpenRouter
 * @returns {Promise<Array>} Lista de modelos disponíveis
 */
export const getAvailableModels = async () => {
  try {
    const response = await axios.get('https://openrouter.ai/api/v1/models', {
      headers: {
        'HTTP-Referer': 'https://docai.com.br',
        'X-Title': 'Doc.AI'
      }
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Erro ao obter modelos do OpenRouter:', error);
    throw error;
  }
};

/**
 * Organiza os modelos por provedor
 * @param {Array} models Lista de modelos do OpenRouter
 * @returns {Object} Objeto com modelos organizados por provedor
 */
export const organizeModelsByProvider = (models) => {
  const providers = {};
  
  // Extrair provedores únicos
  models.forEach(model => {
    const providerName = model.id.split('/')[0];
    
    if (!providers[providerName]) {
      providers[providerName] = {
        name: getProviderDisplayName(providerName),
        models: []
      };
    }
    
    providers[providerName].models.push({
      id: model.id,
      name: model.name || model.id.split('/')[1],
      context_length: model.context_length,
      pricing: model.pricing
    });
  });
  
  return providers;
};

/**
 * Obtém o nome de exibição do provedor
 * @param {String} providerCode Código do provedor
 * @returns {String} Nome de exibição do provedor
 */
const getProviderDisplayName = (providerCode) => {
  const providerNames = {
    'openai': 'OpenAI',
    'anthropic': 'Anthropic',
    'google': 'Google',
    'meta': 'Meta',
    'mistral': 'Mistral AI',
    'cohere': 'Cohere',
    'perplexity': 'Perplexity',
    'deepseek': 'DeepSeek',
    'databricks': 'Databricks',
    'fireworks': 'Fireworks',
    'groq': 'Groq',
    'anyscale': 'Anyscale',
    'azure': 'Azure OpenAI',
    'together': 'Together AI',
    'palm': 'Google PaLM',
    'claude': 'Claude',
    'gpt': 'GPT',
    'llama': 'Llama'
  };
  
  return providerNames[providerCode] || providerCode;
};

export default {
  getAvailableModels,
  organizeModelsByProvider
};
