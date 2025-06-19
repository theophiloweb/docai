/**
 * Seeder de Configurações de IA
 * 
 * Este arquivo cria configurações de IA fictícias para testes.
 * 
 * @author Doc.AI Team
 */

const { AISettings } = require('../../models');
const logger = require('../../utils/logger');

const createAISettings = async () => {
  try {
    // Criar configurações de IA fictícias
    const aiSettings = [
      {
        name: 'Llama Local',
        provider: 'llama',
        apiKey: 'local-dev-key',
        apiUrl: 'http://localhost:8080/v1/chat/completions',
        model: 'llama-3',
        maxTokens: 2000,
        temperature: 0.7,
        isActive: true,
        settings: {
          presence_penalty: 0,
          frequency_penalty: 0,
          top_p: 1
        },
        usageLimit: 10000,
        usageCount: 5432,
        lastUsed: new Date()
      },
      {
        name: 'OpenAI GPT-4',
        provider: 'openai',
        apiKey: 'sk-openai-key-example',
        apiUrl: 'https://api.openai.com/v1',
        model: 'gpt-4',
        maxTokens: 2000,
        temperature: 0.7,
        isActive: false,
        settings: {
          presence_penalty: 0,
          frequency_penalty: 0,
          top_p: 1
        },
        usageLimit: 10000,
        usageCount: 5432,
        lastUsed: new Date()
      },
      {
        name: 'OpenAI GPT-3.5 Turbo',
        provider: 'openai',
        apiKey: 'sk-openai-key-example-2',
        apiUrl: 'https://api.openai.com/v1',
        model: 'gpt-3.5-turbo',
        maxTokens: 1500,
        temperature: 0.5,
        isActive: false,
        settings: {
          presence_penalty: 0,
          frequency_penalty: 0,
          top_p: 1
        },
        usageLimit: 50000,
        usageCount: 32145,
        lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 dias atrás
      },
      {
        name: 'Claude 3',
        provider: 'anthropic',
        apiKey: 'sk-anthropic-key-example',
        apiUrl: 'https://api.anthropic.com/v1',
        model: 'claude-3-opus-20240229',
        maxTokens: 3000,
        temperature: 0.7,
        isActive: false,
        settings: {
          top_k: 40,
          top_p: 0.95
        },
        usageLimit: 5000,
        usageCount: 1234,
        lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 dias atrás
      }
    ];

    for (const setting of aiSettings) {
      await AISettings.create(setting);
    }

    logger.info('Configurações de IA criadas com sucesso!');
  } catch (error) {
    logger.error('Erro ao criar configurações de IA:', error);
  }
};

module.exports = createAISettings;
