# Integração com IA - Doc.AI

Este documento detalha a integração do sistema Doc.AI com serviços de Inteligência Artificial para processamento de documentos e geração de insights.

## Visão Geral

O Doc.AI utiliza IA em dois processos principais:

1. **Processamento de Documentos**: Extração de texto via OCR, categorização automática e identificação de entidades
2. **Geração de Insights**: Análise dos dados extraídos para fornecer recomendações e insights personalizados

## Provedores de IA

O sistema está configurado para utilizar o OpenRouter como gateway para acessar diferentes modelos de IA:

- **Llama 4**: Modelo principal para geração de insights
- **Outros modelos disponíveis**: GPT-4, Claude, Gemini, etc.

A configuração do provedor de IA é gerenciada através do arquivo `.env` no backend.

## Processamento de Documentos

### Fluxo de Processamento

1. **Upload do Documento**: O usuário faz upload de um documento
2. **Extração de Texto**: O sistema utiliza Tesseract.js para OCR
3. **Categorização**: A IA analisa o conteúdo e categoriza o documento
4. **Extração de Entidades**: A IA identifica entidades relevantes (datas, valores, nomes, etc.)
5. **Armazenamento**: Os dados extraídos são armazenados no banco de dados

### Categorias de Documentos

O sistema reconhece automaticamente as seguintes categorias de documentos:

- **Médicos**: Consultas, exames, receitas, laudos
- **Financeiros**: Faturas, recibos, extratos, notas fiscais
- **Orçamentos**: Orçamentos de produtos e serviços
- **Pessoais**: Documentos de identificação, certificados, diplomas
- **Outros**: Documentos que não se encaixam nas categorias anteriores

### Exemplo de Processamento

```javascript
// Serviço de processamento de documentos
const processDocument = async (document) => {
  try {
    // Extrair texto via OCR
    const text = await ocrService.extractText(document.filePath);
    
    // Categorizar documento
    const category = await aiService.categorizeDocument(text);
    
    // Extrair entidades
    const entities = await aiService.extractEntities(text, category);
    
    // Atualizar documento com informações extraídas
    await document.update({
      contentText: text,
      category,
      aiProcessed: true,
      aiEntities: entities
    });
    
    // Processar dados específicos da categoria
    if (category === 'medical') {
      await processMedicalDocument(document, text, entities);
    } else if (category === 'financial') {
      await processFinancialDocument(document, text, entities);
    } else if (category === 'budget') {
      await processBudgetDocument(document, text, entities);
    }
    
    return document;
  } catch (error) {
    logger.error('Erro ao processar documento:', error);
    throw error;
  }
};
```

## Geração de Insights

### Tipos de Insights

O sistema gera quatro tipos de insights:

1. **Insights Gerais**: Combinam dados de diferentes categorias
2. **Insights Médicos**: Analisam tendências em exames e consultas
3. **Insights Financeiros**: Analisam padrões de gastos e receitas
4. **Insights de Orçamentos**: Comparam e recomendam melhores opções

### Prompts de IA

Os prompts para geração de insights são armazenados na tabela `AIPrompts` e podem ser personalizados pelo administrador do sistema através do painel administrativo.

Para uma lista completa dos prompts e suas localizações no código, consulte o arquivo [LOCALIZACAO_PROMPTS.md](LOCALIZACAO_PROMPTS.md).

#### Exemplo de Prompt para Insights Médicos

```
Analise os seguintes dados médicos e forneça insights relevantes:
- Identifique tendências nos sinais vitais e exames laboratoriais
- Sugira acompanhamentos necessários com base nos resultados
- Destaque valores fora dos padrões normais
- Sugira próximas consultas ou exames com base no histórico
- Mantenha um tom informativo e profissional
- Limite a resposta a 2-3 insights importantes
- Cada insight deve ter um título curto e uma descrição concisa
```

#### Exemplo de Prompt para Insights Financeiros

```
Analise os seguintes dados financeiros e forneça insights relevantes:
- Identifique padrões de gastos e receitas
- Destaque categorias com maiores despesas
- Sugira possíveis economias ou otimizações financeiras
- Compare com períodos anteriores para identificar tendências
- Alerte sobre faturas próximas do vencimento
- Mantenha um tom informativo e profissional
- Limite a resposta a 2-3 insights importantes
- Cada insight deve ter um título curto e uma descrição concisa
```

#### Exemplo de Prompt para Insights de Orçamentos

```
Analise os seguintes dados de orçamentos e forneça insights relevantes:

Você está analisando um grupo de orçamentos para o mesmo produto ou serviço.

Por favor, forneça uma análise detalhada considerando:

1. Comparação de Preços: Compare os preços entre os diferentes fornecedores e identifique qual oferece o melhor valor.

2. Análise de Qualidade: Avalie a qualidade do produto/serviço com base nas avaliações, garantia e reputação do fornecedor.

3. Recomendação Final: Indique qual opção oferece o melhor custo-benefício e explique por que não recomenda as outras opções.

4. Fatores de Risco: Identifique possíveis riscos em cada opção (preço muito baixo, fornecedor com má reputação, etc.).

5. Considerações Adicionais: Mencione outros fatores relevantes como tempo de entrega, condições de pagamento, etc.

Formate sua resposta de forma clara e objetiva, com uma recomendação final explícita.
```

### Fluxo de Geração de Insights

1. O frontend solicita insights ao backend através do serviço `aiService.js`
2. O backend obtém as configurações de IA do arquivo `.env`
3. O backend prepara os dados e o prompt adequado
4. A solicitação é enviada para a API do OpenRouter
5. O OpenRouter direciona a solicitação para o modelo especificado (Llama 4)
6. A resposta da IA é processada e formatada pelo backend
7. Os insights são retornados ao frontend para exibição

```javascript
// Função para chamar a API de IA no backend
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
exports.generateMedicalInsights = async (req, res) => {
  try {
    const { data } = req.body;
    
    // Obter provedor de IA ativo
    const provider = await getActiveAIProvider();
    
    // Obter prompt para insights médicos
    const promptTemplate = await AIPrompt.findOne({
      where: { category: 'medical', isActive: true },
      order: [['updatedAt', 'DESC']]
    });
    
    if (!promptTemplate) {
      throw new Error('Prompt para insights médicos não encontrado');
    }
    
    // Preparar dados para a IA
    const aiData = {
      medicalRecords: data.records,
      vitalSigns: data.vitalSigns,
      labResults: data.labResults
    };
    
    // Chamar API de IA
    const aiResponse = await callAIProvider(
      provider,
      promptTemplate.prompt,
      aiData
    );
    
    // Processar resposta
    const insights = processAIResponse(aiResponse);
    
    return res.status(200).json({
      success: true,
      message: 'Insights médicos gerados com sucesso',
      data: insights
    });
  } catch (error) {
    logger.error('Erro ao gerar insights médicos:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao gerar insights médicos',
      error: error.message
    });
  }
};
```

## Configuração da API de IA

A configuração da API de IA é gerenciada através do arquivo `.env` no backend:

```
# Configurações de API de IA
AI_API_KEY=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
AI_API_URL=https://openrouter.ai/api/v1
AI_PROVIDER=openrouter
AI_MODEL=meta/llama-3-70b
```

Para alterar o modelo de IA ou a chave API, edite estas variáveis no arquivo `.env`.

### OpenRouter

O sistema utiliza o OpenRouter como gateway para acessar diferentes modelos de IA. O OpenRouter permite acesso a uma variedade de modelos, incluindo:

- Meta Llama 3 (meta/llama-3-70b)
- OpenAI GPT-4 (openai/gpt-4-turbo)
- Anthropic Claude (anthropic/claude-3-opus)
- Google Gemini (google/gemini-pro)
- E muitos outros

A lista completa de modelos é obtida dinamicamente através da API do OpenRouter, garantindo que o sistema sempre tenha acesso aos modelos mais recentes.

Para mais informações sobre os modelos disponíveis, consulte a [documentação do OpenRouter](https://openrouter.ai/docs).

## Implementação do Serviço de IA

### Frontend

```javascript
// Serviço de IA no frontend
import api from './api';

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
```

### Backend

```javascript
// Função para obter configurações de IA do .env
const getAIConfig = () => {
  return {
    provider: process.env.AI_PROVIDER || 'openrouter',
    apiKey: process.env.AI_API_KEY,
    apiUrl: process.env.AI_API_URL || 'https://openrouter.ai/api/v1',
    model: process.env.AI_MODEL || 'llama-4',
    temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
    maxTokens: parseInt(process.env.AI_MAX_TOKENS || '1000')
  };
};

// Controlador para gerar insights
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
      // Tratamento de erro e fallback
      // ...
    }
  } catch (error) {
    // Tratamento de erro
    // ...
  }
};
```

## Considerações de Segurança

### Sanitização de Dados

Todos os dados enviados para a IA são sanitizados para remover informações sensíveis:

```javascript
// Função para sanitizar dados
const sanitizeData = (data) => {
  // Criar cópia profunda dos dados
  const sanitized = JSON.parse(JSON.stringify(data));
  
  // Remover informações sensíveis
  if (sanitized.user) {
    delete sanitized.user.password;
    delete sanitized.user.resetPasswordToken;
    delete sanitized.user.verificationToken;
    
    // Mascarar email
    if (sanitized.user.email) {
      const [username, domain] = sanitized.user.email.split('@');
      sanitized.user.email = `${username.substring(0, 2)}***@${domain}`;
    }
    
    // Mascarar nome
    if (sanitized.user.name) {
      const names = sanitized.user.name.split(' ');
      if (names.length > 1) {
        sanitized.user.name = `${names[0]} ${names[names.length - 1].substring(0, 1)}.`;
      }
    }
  }
  
  return sanitized;
};
```

### Conformidade com a LGPD

A integração com IA segue os princípios da LGPD:

- **Consentimento**: O usuário deve consentir explicitamente com o processamento de seus documentos por IA
- **Finalidade**: O processamento é realizado apenas para os fins especificados
- **Transparência**: O usuário é informado sobre como seus dados são processados
- **Segurança**: Os dados são transmitidos e armazenados de forma segura
- **Minimização**: Apenas os dados necessários são enviados para a IA

## Monitoramento e Logs

O sistema mantém logs detalhados de todas as interações com a IA:

```javascript
// Função para registrar interação com IA
const logAIInteraction = async (userId, type, prompt, response) => {
  try {
    await Log.create({
      userId,
      action: `ai_${type}`,
      details: {
        prompt,
        responseLength: response.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Erro ao registrar interação com IA:', error);
  }
};
```

## Gerenciamento de Prompts

Os prompts de IA podem ser gerenciados através do painel administrativo:

1. Acesse o painel administrativo
2. Navegue até "Configurações de IA"
3. Role até a seção "Prompts de IA"
4. Clique no botão de edição (ícone de lápis) ao lado do prompt desejado
5. Edite o prompt conforme necessário
6. Clique em "Salvar" para aplicar as alterações

## Localização dos Prompts no Código

Para uma lista completa dos prompts e suas localizações no código, consulte o arquivo [LOCALIZACAO_PROMPTS.md](LOCALIZACAO_PROMPTS.md).

## Próximos Passos

### Melhorias Planejadas

1. **Treinamento de Modelos Específicos**:
   - Treinar modelos específicos para diferentes tipos de documentos
   - Implementar fine-tuning para melhorar a precisão

2. **Aprendizado Contínuo**:
   - Implementar feedback do usuário para melhorar os insights
   - Utilizar técnicas de aprendizado por reforço

3. **Processamento Avançado**:
   - Implementar reconhecimento de assinaturas
   - Adicionar verificação de autenticidade de documentos
   - Implementar detecção de fraudes

4. **Otimização de Prompts**:
   - Desenvolver prompts mais específicos para diferentes cenários
   - Implementar sistema de versionamento de prompts

5. **Integração com Outros Serviços**:
   - Conectar com APIs externas para enriquecer os insights
   - Implementar alertas baseados em dados externos
