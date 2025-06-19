/**
 * Script para criar prompts de IA iniciais
 * 
 * Este script cria prompts de IA no banco de dados.
 * 
 * @author Doc.AI Team
 */

const { AIPrompt, sequelize } = require('../models');

async function createPrompts() {
  try {
    // Conectar ao banco de dados
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');

    // Verificar se já existem prompts
    const existingPrompts = await AIPrompt.findAll();
    
    if (existingPrompts.length > 0) {
      console.log(`${existingPrompts.length} prompts já existem no banco de dados.`);
    }

    // Criar prompts iniciais
    const prompts = [
      {
        title: 'Análise de Orçamentos',
        description: 'Prompt para análise comparativa de orçamentos',
        prompt: generateBudgetAnalysisPrompt(),
        category: 'budget',
        isActive: true
      },
      {
        title: 'Comparação de Orçamentos',
        description: 'Prompt para comparação detalhada entre orçamentos do mesmo produto',
        prompt: generateBudgetComparisonPrompt(),
        category: 'budget',
        isActive: true
      },
      {
        title: 'Análise de Documentos Médicos',
        description: 'Prompt para extrair informações relevantes de documentos médicos',
        prompt: generateMedicalAnalysisPrompt(),
        category: 'medical',
        isActive: true
      },
      {
        title: 'Análise Financeira',
        description: 'Prompt para análise de documentos financeiros',
        prompt: generateFinancialAnalysisPrompt(),
        category: 'financial',
        isActive: true
      }
    ];

    // Inserir prompts no banco de dados
    for (const promptData of prompts) {
      const [prompt, created] = await AIPrompt.findOrCreate({
        where: { title: promptData.title },
        defaults: promptData
      });

      if (created) {
        console.log(`Prompt "${promptData.title}" criado com sucesso.`);
      } else {
        console.log(`Prompt "${promptData.title}" já existe.`);
      }
    }

    console.log('Prompts criados com sucesso!');
  } catch (error) {
    console.error('Erro ao criar prompts:', error);
  } finally {
    // Fechar conexão
    await sequelize.close();
  }
}

// Exemplos de prompts
const generateBudgetAnalysisPrompt = () => {
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
};

const generateBudgetComparisonPrompt = () => {
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
};

const generateMedicalAnalysisPrompt = () => {
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
};

const generateFinancialAnalysisPrompt = () => {
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
};

// Executar função
createPrompts();
