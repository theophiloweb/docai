# Localização dos Prompts de IA - Doc.AI

Este documento lista a localização de todos os prompts de IA no código-fonte do projeto Doc.AI, facilitando a manutenção e atualização dos mesmos.

## Frontend

### 1. Serviço de IA (aiService.js)

**Arquivo**: `/frontend/src/services/aiService.js`

#### Prompt para Insights Médicos
- **Linhas**: 17-27
- **Função**: `generateMedicalInsights`
- **Descrição**: Gera insights baseados em dados médicos do usuário
```javascript
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
```

#### Prompt para Insights Financeiros
- **Linhas**: 39-51
- **Função**: `generateFinancialInsights`
- **Descrição**: Gera insights baseados em dados financeiros do usuário
```javascript
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
```

#### Prompt para Insights de Orçamentos
- **Linhas**: 63-85
- **Função**: `generateBudgetInsights`
- **Descrição**: Gera insights baseados em dados de orçamentos do usuário
```javascript
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
```

#### Prompt para Insights Gerais
- **Linhas**: 117-133
- **Função**: `generateGeneralInsights`
- **Descrição**: Gera insights gerais baseados em todos os dados do usuário
```javascript
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
```

### 2. Componente AIPromptManager

**Arquivo**: `/frontend/src/components/admin/AIPromptManager.js`

#### Prompt para Análise de Orçamentos
- **Linhas**: 52-67
- **Função**: `generateBudgetAnalysisPrompt`
- **Descrição**: Exemplo de prompt para análise comparativa de orçamentos
```javascript
return `Você é um consultor financeiro especializado em análise de custo-benefício e comparação de orçamentos para compras pessoais. 
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
5. Explicar por que as outras opções não foram selecionadas`;
```

#### Prompt para Comparação de Orçamentos
- **Linhas**: 69-81
- **Função**: `generateBudgetComparisonPrompt`
- **Descrição**: Exemplo de prompt para comparação detalhada entre orçamentos do mesmo produto
```javascript
return `Você é um consultor especializado em análise de custo-benefício e tomada de decisão para compras pessoais.
  
Analise detalhadamente os seguintes orçamentos para o produto e forneça uma recomendação clara e bem fundamentada.

IMPORTANTE: Sua análise deve ir além do preço mais baixo. Considere todos os fatores que impactam o valor real da compra:
- Reputação do fornecedor (pontuação no ReclameAqui)
- Prazo de entrega (quanto menor, melhor)
- Garantia (quanto maior o período, melhor)
- Avaliações do produto
- Taxa de depreciação do produto
- Custos adicionais como frete
- Fatores de risco identificados`;
```

#### Prompt para Análise de Documentos Médicos
- **Linhas**: 83-100
- **Função**: `generateMedicalAnalysisPrompt`
- **Descrição**: Exemplo de prompt para extrair informações relevantes de documentos médicos
```javascript
return `Você é um assistente especializado em análise de documentos médicos.
    
Sua tarefa é extrair e organizar informações relevantes dos documentos médicos fornecidos.
Identifique e estruture as seguintes informações quando disponíveis:

1. Dados do paciente (nome, idade, gênero)
2. Tipo de exame ou procedimento
3. Data do exame ou procedimento
4. Resultados principais e valores de referência
5. Diagnósticos mencionados
6. Recomendações médicas
7. Medicamentos prescritos e posologia
8. Alergias ou contraindicações mencionadas

Apresente as informações de forma estruturada e organizada.
Não faça suposições médicas além do que está explicitamente mencionado no documento.
Indique claramente quando uma informação solicitada não estiver disponível no documento.`;
```

#### Prompt para Análise de Documentos Financeiros
- **Linhas**: 102-119
- **Função**: `generateFinancialAnalysisPrompt`
- **Descrição**: Exemplo de prompt para análise de documentos financeiros
```javascript
return `Você é um assistente especializado em análise de documentos financeiros.
    
Sua tarefa é extrair e organizar informações relevantes dos documentos financeiros fornecidos.
Identifique e estruture as seguintes informações quando disponíveis:

1. Tipo de documento financeiro
2. Data do documento
3. Valores principais (receitas, despesas, saldo)
4. Categorias de despesas identificadas
5. Fontes de receita identificadas
6. Tendências financeiras observáveis
7. Alertas sobre valores incomuns ou discrepantes
8. Recomendações para otimização financeira

Apresente as informações de forma estruturada e organizada.
Não faça suposições financeiras além do que está explicitamente mencionado no documento.
Indique claramente quando uma informação solicitada não estiver disponível no documento.`;
```

## Backend

### 1. Controlador de IA (ai.controller.js)

**Arquivo**: `/backend/src/controllers/ai.controller.js`

#### Prompt para Análise de Orçamentos
- **Linhas**: 486-517
- **Função**: `generateBudgetAnalysisPrompt`
- **Descrição**: Gera um prompt detalhado para análise de orçamentos
```javascript
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
```

## Banco de Dados

### Tabela AIPrompt

Os prompts também são armazenados no banco de dados na tabela `AIPrompts`. Estes prompts podem ser editados através da interface administrativa do sistema.

Para visualizar ou editar estes prompts:

1. Acesse o painel administrativo
2. Navegue até "Configurações de IA"
3. Role até a seção "Prompts de IA"
4. Clique no botão de edição (ícone de lápis) ao lado do prompt desejado

## Configuração da API de IA

A configuração da API de IA é armazenada no arquivo `.env` do backend:

```
# Configurações de API de IA
AI_API_KEY=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
AI_API_URL=https://openrouter.ai/api/v1
AI_PROVIDER=openrouter
AI_MODEL=llama-4
```

Para alterar o provedor ou modelo de IA, edite estas variáveis no arquivo `.env`.

## Fluxo de Processamento dos Prompts

1. O frontend solicita insights ao backend através do serviço `aiService.js`
2. O backend recebe a solicitação e obtém as configurações de IA do arquivo `.env`
3. O backend gera um prompt adequado para o tipo de análise solicitada
4. O backend envia o prompt para a API de IA (OpenRouter)
5. A API de IA processa o prompt e retorna uma resposta
6. O backend processa a resposta e extrai informações relevantes
7. O backend retorna os insights processados para o frontend
8. O frontend exibe os insights para o usuário
