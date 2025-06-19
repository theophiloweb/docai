/**
 * Obter dados de exemplo para desenvolvimento
 * @returns {Array} - Array de orçamentos de exemplo
 */
const getMockBudgets = () => {
  return [
    {
      id: '1',
      title: 'Notebook Dell Inspiron 15',
      provider: 'Dell Computadores',
      providerCNPJ: '72.381.189/0001-10',
      issueDate: '2025-05-15',
      validUntil: '2025-06-15',
      totalAmount: 4599.90,
      currency: 'BRL',
      category: 'tecnologia',
      status: 'pendente',
      items: [
        {
          description: 'Notebook Dell Inspiron 15 3000',
          quantity: 1,
          unitPrice: 4599.90
        }
      ],
      paymentTerms: 'À vista ou em até 12x sem juros',
      deliveryTerms: 'Entrega em até 10 dias úteis',
      notes: 'Inclui garantia de 1 ano',
      contactInfo: {
        nome: 'Atendimento Dell',
        email: 'vendas@dell.com',
        telefone: '(11) 4004-0000'
      },
      groupId: 'notebook-dell-inspiron-group',
      deliveryTime: 10,
      warranty: '12 meses',
      warrantyMonths: 12,
      shippingCost: 0,
      reclameAquiScore: 7.8,
      productRating: 4.5,
      depreciation: 25,
      riskFactors: ['Modelo com mais de 6 meses no mercado']
    },
    {
      id: '2',
      title: 'Notebook Dell Inspiron 15',
      provider: 'Magazine Luiza',
      providerCNPJ: '47.960.950/0001-21',
      issueDate: '2025-05-20',
      validUntil: '2025-06-20',
      totalAmount: 4799.90,
      currency: 'BRL',
      category: 'tecnologia',
      status: 'pendente',
      items: [
        {
          description: 'Notebook Dell Inspiron 15 3000',
          quantity: 1,
          unitPrice: 4799.90
        }
      ],
      paymentTerms: 'À vista ou em até 10x sem juros',
      deliveryTerms: 'Entrega em até 15 dias úteis',
      notes: 'Frete grátis para todo o Brasil',
      contactInfo: {
        nome: 'SAC Magazine Luiza',
        email: 'sac@magazineluiza.com.br',
        telefone: '(11) 3504-2500'
      },
      groupId: 'notebook-dell-inspiron-group',
      deliveryTime: 15,
      warranty: '12 meses',
      warrantyMonths: 12,
      shippingCost: 0,
      reclameAquiScore: 6.5,
      productRating: 4.5,
      depreciation: 25,
      riskFactors: ['Preço acima da média', 'Tempo de entrega longo']
    },
    {
      id: '3',
      title: 'Notebook Dell Inspiron 15',
      provider: 'Amazon Brasil',
      providerCNPJ: '15.436.940/0001-03',
      issueDate: '2025-05-22',
      validUntil: '2025-06-22',
      totalAmount: 4499.90,
      currency: 'BRL',
      category: 'tecnologia',
      status: 'pendente',
      items: [
        {
          description: 'Notebook Dell Inspiron 15 3000',
          quantity: 1,
          unitPrice: 4499.90
        }
      ],
      paymentTerms: 'À vista ou em até 12x sem juros',
      deliveryTerms: 'Entrega em até 3 dias úteis',
      notes: 'Amazon Prime: entrega expressa',
      contactInfo: {
        nome: 'Atendimento Amazon',
        email: 'atendimento@amazon.com.br',
        telefone: '(11) 4004-1999'
      },
      groupId: 'notebook-dell-inspiron-group',
      deliveryTime: 3,
      warranty: '12 meses',
      warrantyMonths: 12,
      shippingCost: 0,
      reclameAquiScore: 8.2,
      productRating: 4.5,
      depreciation: 25,
      riskFactors: []
    },
    {
      id: '4',
      title: 'Geladeira Electrolux Frost Free',
      provider: 'Casas Bahia',
      providerCNPJ: '33.041.260/0652-90',
      issueDate: '2025-06-02',
      validUntil: '2025-07-02',
      totalAmount: 3299.90,
      currency: 'BRL',
      category: 'eletrodomestico',
      status: 'pendente',
      items: [
        {
          description: 'Geladeira Electrolux Frost Free 382L',
          quantity: 1,
          unitPrice: 3299.90
        }
      ],
      paymentTerms: 'À vista ou em até 12x sem juros',
      deliveryTerms: 'Entrega em até 10 dias úteis',
      notes: 'Instalação não inclusa',
      contactInfo: {
        nome: 'SAC Casas Bahia',
        email: 'sac@casasbahia.com.br',
        telefone: '(11) 3003-8889'
      },
      groupId: 'geladeira-electrolux-group',
      deliveryTime: 10,
      warranty: '12 meses',
      warrantyMonths: 12,
      shippingCost: 150,
      reclameAquiScore: 7.2,
      productRating: 4.5,
      depreciation: 18,
      riskFactors: []
    },
    {
      id: '5',
      title: 'Geladeira Electrolux Frost Free',
      provider: 'Fast Shop',
      providerCNPJ: '43.708.379/0001-00',
      issueDate: '2025-06-03',
      validUntil: '2025-07-03',
      totalAmount: 3399.90,
      currency: 'BRL',
      category: 'eletrodomestico',
      status: 'pendente',
      items: [
        {
          description: 'Geladeira Electrolux Frost Free 382L',
          quantity: 1,
          unitPrice: 3399.90
        }
      ],
      paymentTerms: 'À vista com 5% de desconto ou em até 10x sem juros',
      deliveryTerms: 'Entrega em até 7 dias úteis',
      notes: 'Instalação gratuita',
      contactInfo: {
        nome: 'SAC Fast Shop',
        email: 'sac@fastshop.com.br',
        telefone: '(11) 3003-3728'
      },
      groupId: 'geladeira-electrolux-group',
      deliveryTime: 7,
      warranty: '12 meses',
      warrantyMonths: 12,
      shippingCost: 0,
      reclameAquiScore: 8.5,
      productRating: 4.5,
      depreciation: 18,
      riskFactors: []
    },
    {
      id: '6',
      title: 'Notebook Sansung A20',
      provider: 'Loja A',
      providerCNPJ: '12.345.678/0001-90',
      issueDate: '2025-05-19',
      validUntil: '2025-06-19',
      totalAmount: 2000.00,
      currency: 'BRL',
      category: 'tecnologia',
      status: 'pendente',
      items: [
        {
          description: 'Notebook Sansung A20 Novo',
          quantity: 1,
          unitPrice: 2000.00
        }
      ],
      paymentTerms: 'À vista ou em até 10x sem juros',
      deliveryTerms: 'Entrega em até 5 dias úteis',
      notes: 'Garantia de 12 meses',
      contactInfo: {
        nome: 'Atendimento Loja A',
        email: 'atendimento@lojaa.com.br',
        telefone: '(11) 1234-5678'
      },
      groupId: 'notebook-comparacao-group',
      deliveryTime: 5,
      warranty: '12 meses',
      warrantyMonths: 12,
      shippingCost: 0,
      reclameAquiScore: 7.0,
      productRating: 3.8,
      depreciation: 30,
      riskFactors: ['Marca com histórico de problemas de assistência técnica']
    },
    {
      id: '7',
      title: 'Notebook Dell Inspiron 15',
      provider: 'Loja B',
      providerCNPJ: '23.456.789/0001-01',
      issueDate: '2025-05-20',
      validUntil: '2025-06-20',
      totalAmount: 1800.00,
      currency: 'BRL',
      category: 'tecnologia',
      status: 'pendente',
      items: [
        {
          description: 'Notebook Dell Inspiron 15 Novo',
          quantity: 1,
          unitPrice: 1800.00
        }
      ],
      paymentTerms: 'À vista ou em até 12x sem juros',
      deliveryTerms: 'Entrega em até 7 dias úteis',
      notes: 'Garantia de 12 meses',
      contactInfo: {
        nome: 'Atendimento Loja B',
        email: 'atendimento@lojab.com.br',
        telefone: '(11) 2345-6789'
      },
      groupId: 'notebook-comparacao-group',
      deliveryTime: 7,
      warranty: '12 meses',
      warrantyMonths: 12,
      shippingCost: 0,
      reclameAquiScore: 8.5,
      productRating: 4.7,
      depreciation: 25,
      riskFactors: []
    },
    {
      id: '8',
      title: 'Notebook Philco D20',
      provider: 'Loja C',
      providerCNPJ: '34.567.890/0001-12',
      issueDate: '2025-05-22',
      validUntil: '2025-06-22',
      totalAmount: 1500.00,
      currency: 'BRL',
      category: 'tecnologia',
      status: 'pendente',
      items: [
        {
          description: 'Notebook Philco D20 Novo',
          quantity: 1,
          unitPrice: 1500.00
        }
      ],
      paymentTerms: 'À vista ou em até 10x sem juros',
      deliveryTerms: 'Entrega em até 10 dias úteis',
      notes: 'Garantia de 12 meses',
      contactInfo: {
        nome: 'Atendimento Loja C',
        email: 'atendimento@lojac.com.br',
        telefone: '(11) 3456-7890'
      },
      groupId: 'notebook-comparacao-group',
      deliveryTime: 10,
      warranty: '12 meses',
      warrantyMonths: 12,
      shippingCost: 0,
      reclameAquiScore: 6.8,
      productRating: 3.5,
      depreciation: 35,
      riskFactors: ['Marca com alto índice de defeitos']
    }
  ];
};
/**
 * Controlador de Orçamentos
 * 
 * Este controlador gerencia as operações relacionadas aos orçamentos.
 * 
 * @author Doc.AI Team
 */

const { BudgetRecord, Document, User, sequelize } = require('../models');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const aiController = require('./ai.controller');
const logger = require('../utils/logger');

/**
 * Obter todos os orçamentos do usuário
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 */
exports.getAllBudgets = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Buscar registros de orçamentos do usuário
    const budgetRecords = await BudgetRecord.findAll({
      where: { userId },
      order: [['issueDate', 'DESC']],
      include: [
        {
          model: Document,
          as: 'document',
          attributes: ['id', 'title', 'category', 'filePath']
        }
      ]
    });
    
    // Contar orçamentos por status
    const pendingCount = budgetRecords.filter(record => record.status === 'pendente').length;
    const approvedCount = budgetRecords.filter(record => record.status === 'aprovado').length;
    const rejectedCount = budgetRecords.filter(record => record.status === 'recusado').length;
    const closedCount = budgetRecords.filter(record => record.status === 'fechado').length;
    
    // Calcular valor total dos orçamentos
    const totalAmount = budgetRecords.reduce((sum, record) => sum + parseFloat(record.totalAmount || 0), 0);
    
    // Preparar dados para gráficos
    const budgetsByCategory = prepareBudgetsByCategoryData(budgetRecords);
    const budgetsByStatus = prepareBudgetsByStatusData(budgetRecords);
    
    // Estruturar dados para o frontend
    const responseData = {
      records: budgetRecords,
      summary: {
        totalBudgets: budgetRecords.length,
        pendingBudgets: pendingCount,
        approvedBudgets: approvedCount,
        rejectedBudgets: rejectedCount,
        closedBudgets: closedCount,
        totalAmount
      },
      budgetsByCategory,
      budgetsByStatus
    };
    
    res.status(200).json({
      success: true,
      message: 'Orçamentos obtidos com sucesso',
      data: responseData
    });
  } catch (error) {
    logger.error('Erro ao obter orçamentos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao obter orçamentos',
      error: error.message
    });
  }
};

/**
 * Obter dados para o dashboard de orçamentos
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 */
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Buscar registros de orçamentos do usuário
    const budgetRecords = await BudgetRecord.findAll({
      where: { userId },
      order: [['issueDate', 'DESC']],
      limit: 50
    });
    
    // Contar orçamentos por status
    const pendingCount = budgetRecords.filter(record => record.status === 'pendente').length;
    const approvedCount = budgetRecords.filter(record => record.status === 'aprovado').length;
    const rejectedCount = budgetRecords.filter(record => record.status === 'recusado').length;
    const closedCount = budgetRecords.filter(record => record.status === 'fechado').length;
    
    // Calcular valor total dos orçamentos
    const totalAmount = budgetRecords.reduce((sum, record) => sum + parseFloat(record.totalAmount || 0), 0);
    
    // Preparar dados para gráficos
    const budgetsByCategory = prepareBudgetsByCategoryData(budgetRecords);
    const budgetsByStatus = prepareBudgetsByStatusData(budgetRecords);
    const budgetsTrend = prepareBudgetsTrendData(budgetRecords);
    
    // Preparar dados para análise de IA
    const budgetData = {
      records: budgetRecords.map(record => ({
        title: record.title,
        provider: record.provider,
        issueDate: record.issueDate,
        validUntil: record.validUntil,
        totalAmount: record.totalAmount,
        category: record.category,
        status: record.status,
        items: record.items,
        paymentTerms: record.paymentTerms,
        deliveryTerms: record.deliveryTerms,
        notes: record.notes,
        contactInfo: record.contactInfo,
        competingQuotes: record.competingQuotes,
        groupId: record.groupId
      })),
      summary: {
        totalBudgets: budgetRecords.length,
        pendingCount,
        approvedCount,
        rejectedCount,
        closedCount,
        totalAmount
      },
      categories: budgetsByCategory,
      statuses: budgetsByStatus,
      trends: budgetsTrend
    };
    
    // Gerar análises de IA
    let aiAnalysis = {
      overview: "Você tem orçamentos ativos em diferentes categorias. Verifique os orçamentos pendentes que precisam de sua atenção.",
      recommendations: "Recomendamos analisar os orçamentos agrupados, onde há diferenças significativas de preço entre as opções.",
      comparison: "Entre os orçamentos de um mesmo grupo, considere não apenas o preço, mas também a reputação do fornecedor e condições de garantia."
    };
    
    try {
      // Chamar serviço de IA para gerar insights
      const aiResponse = await aiController.generateBudgetInsightsInternal(budgetData);
      
      if (aiResponse && aiResponse.length > 0) {
        // Extrair análises dos insights
        const overviewInsight = aiResponse.find(insight => 
          insight.title.toLowerCase().includes('visão') || 
          insight.title.toLowerCase().includes('geral') ||
          insight.title.toLowerCase().includes('overview')
        );
        
        const recommendationsInsight = aiResponse.find(insight => 
          insight.title.toLowerCase().includes('recomend') ||
          insight.title.toLowerCase().includes('sugest')
        );
        
        const comparisonInsight = aiResponse.find(insight => 
          insight.title.toLowerCase().includes('compar') ||
          insight.title.toLowerCase().includes('análise')
        );
        
        // Atualizar análises se encontradas
        if (overviewInsight) {
          aiAnalysis.overview = overviewInsight.description;
        }
        
        if (recommendationsInsight) {
          aiAnalysis.recommendations = recommendationsInsight.description;
        }
        
        if (comparisonInsight) {
          aiAnalysis.comparison = comparisonInsight.description;
        }
      }
    } catch (error) {
      logger.error('Erro ao gerar análises de IA para dashboard de orçamentos:', error);
      // Manter análises padrão em caso de erro
    }
    
    // Preparar resposta
    const dashboardData = {
      summary: {
        totalBudgets: budgetRecords.length,
        pendingBudgets: pendingCount,
        approvedBudgets: approvedCount,
        rejectedBudgets: rejectedCount,
        closedBudgets: closedCount,
        totalAmount
      },
      latestBudgets: budgetRecords.slice(0, 5).map(record => ({
        id: record.id,
        title: record.title,
        provider: record.provider,
        issueDate: record.issueDate,
        validUntil: record.validUntil,
        totalAmount: parseFloat(record.totalAmount),
        category: record.category,
        status: record.status,
        groupId: record.groupId
      })),
      budgetsByCategory,
      budgetsByStatus,
      budgetsTrend: budgetsTrend,
      aiAnalysis
    };
    
    res.status(200).json({
      success: true,
      message: 'Dados do dashboard de orçamentos obtidos com sucesso',
      data: dashboardData
    });
  } catch (error) {
    logger.error('Erro ao obter dados do dashboard de orçamentos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao obter dados do dashboard de orçamentos',
      error: error.message
    });
  }
};

/**
 * Preparar dados para gráfico de orçamentos por categoria
 * @param {Array} records - Registros de orçamentos
 * @returns {Object} - Dados formatados para o gráfico
 */
const prepareBudgetsByCategoryData = (records) => {
  const categories = {};
  
  // Calcular total por categoria
  records.forEach(record => {
    if (record.category) {
      const category = record.category.charAt(0).toUpperCase() + record.category.slice(1);
      categories[category] = (categories[category] || 0) + parseFloat(record.totalAmount || 0);
    }
  });
  
  // Converter para arrays para o gráfico
  const labels = Object.keys(categories);
  const data = Object.values(categories);
  
  // Se não houver dados, retornar dados padrão
  if (labels.length === 0) {
    return {
      labels: ['Sem dados'],
      datasets: [
        {
          label: 'Orçamentos por Categoria',
          data: [0],
          backgroundColor: ['rgba(201, 203, 207, 0.7)'],
          borderColor: ['rgb(201, 203, 207)'],
          borderWidth: 1
        }
      ]
    };
  }
  
  // Cores para as categorias
  const backgroundColors = [
    'rgba(255, 99, 132, 0.7)',
    'rgba(54, 162, 235, 0.7)',
    'rgba(255, 206, 86, 0.7)',
    'rgba(75, 192, 192, 0.7)',
    'rgba(153, 102, 255, 0.7)',
    'rgba(255, 159, 64, 0.7)',
    'rgba(201, 203, 207, 0.7)'
  ];
  
  const borderColors = backgroundColors.map(color => color.replace('0.7', '1'));
  
  return {
    labels,
    datasets: [
      {
        label: 'Orçamentos por Categoria',
        data,
        backgroundColor: backgroundColors.slice(0, labels.length),
        borderColor: borderColors.slice(0, labels.length),
        borderWidth: 1
      }
    ]
  };
};

/**
 * Preparar dados para gráfico de orçamentos por status
 * @param {Array} records - Registros de orçamentos
 * @returns {Object} - Dados formatados para o gráfico
 */
const prepareBudgetsByStatusData = (records) => {
  const statuses = {
    'Pendente': 0,
    'Aprovado': 0,
    'Recusado': 0,
    'Fechado': 0
  };
  
  // Contar orçamentos por status
  records.forEach(record => {
    if (record.status) {
      const status = record.status.charAt(0).toUpperCase() + record.status.slice(1);
      statuses[status] = (statuses[status] || 0) + 1;
    }
  });
  
  // Converter para arrays para o gráfico
  const labels = Object.keys(statuses);
  const data = Object.values(statuses);
  
  // Cores para os status
  const backgroundColors = [
    'rgba(255, 206, 86, 0.7)', // Pendente - Amarelo
    'rgba(75, 192, 192, 0.7)', // Aprovado - Verde
    'rgba(255, 99, 132, 0.7)', // Recusado - Vermelho
    'rgba(54, 162, 235, 0.7)'  // Fechado - Azul
  ];
  
  const borderColors = backgroundColors.map(color => color.replace('0.7', '1'));
  
  return {
    labels,
    datasets: [
      {
        label: 'Orçamentos por Status',
        data,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1
      }
    ]
  };
};

/**
 * Preparar dados para gráfico de tendência de orçamentos
 * @param {Array} records - Registros de orçamentos
 * @returns {Object} - Dados formatados para o gráfico
 */
const prepareBudgetsTrendData = (records) => {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const currentMonth = new Date().getMonth();
  const labels = [];
  
  // Obter os últimos 6 meses
  for (let i = 5; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12;
    labels.push(months[monthIndex]);
  }
  
  // Calcular orçamentos por mês
  const budgetsByMonth = Array(6).fill(0);
  const amountsByMonth = Array(6).fill(0);
  
  records.forEach(record => {
    const recordDate = new Date(record.issueDate);
    const monthDiff = (currentMonth - recordDate.getMonth() + 12) % 12;
    
    if (monthDiff < 6) {
      budgetsByMonth[5 - monthDiff] += 1;
      amountsByMonth[5 - monthDiff] += parseFloat(record.totalAmount || 0);
    }
  });
  
  return {
    labels,
    datasets: [
      {
        label: 'Quantidade de Orçamentos',
        data: budgetsByMonth,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1,
        yAxisID: 'y'
      },
      {
        label: 'Valor Total (R$)',
        data: amountsByMonth,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1,
        yAxisID: 'y1'
      }
    ]
  };
};

/**
 * Obter detalhes de um orçamento específico
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 */
exports.getBudgetDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Buscar orçamento
    const budget = await BudgetRecord.findOne({
      where: { id, userId },
      include: [
        {
          model: Document,
          as: 'document'
        }
      ]
    });
    
    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Orçamento não encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Detalhes do orçamento obtidos com sucesso',
      data: budget
    });
  } catch (error) {
    logger.error('Erro ao obter detalhes do orçamento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao obter detalhes do orçamento',
      error: error.message
    });
  }
};

/**
 * Atualizar status de um orçamento
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 */
exports.updateBudgetStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;
    
    // Verificar se o status é válido
    const validStatuses = ['pendente', 'aprovado', 'recusado', 'fechado'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status inválido'
      });
    }
    
    // Buscar orçamento
    const budget = await BudgetRecord.findOne({
      where: { id, userId }
    });
    
    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Orçamento não encontrado'
      });
    }
    
    // Atualizar status
    await budget.update({ status });
    
    // Registrar a mudança de status para análise de comportamento do usuário
    logger.info(`Usuário ${userId} alterou status do orçamento ${id} de ${budget.status} para ${status}`);
    
    res.status(200).json({
      success: true,
      message: 'Status do orçamento atualizado com sucesso',
      data: { id, status }
    });
  } catch (error) {
    logger.error('Erro ao atualizar status do orçamento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar status do orçamento',
      error: error.message
    });
  }
};

/**
 * Obter grupos de orçamentos
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 */
exports.getBudgetGroups = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Buscar todos os orçamentos do usuário
    const budgetRecords = await BudgetRecord.findAll({
      where: { userId },
      order: [['issueDate', 'DESC']]
    });
    
    // Agrupar orçamentos por título e groupId
    const budgetGroups = {};
    
    budgetRecords.forEach(budget => {
      // Usar groupId se existir, caso contrário usar título
      const groupKey = budget.groupId || budget.title.trim();
      
      if (!budgetGroups[groupKey]) {
        budgetGroups[groupKey] = [];
      }
      
      budgetGroups[groupKey].push({
        id: budget.id,
        title: budget.title,
        provider: budget.provider,
        providerCNPJ: budget.providerCNPJ,
        issueDate: budget.issueDate,
        validUntil: budget.validUntil,
        totalAmount: parseFloat(budget.totalAmount),
        status: budget.status,
        groupId: budget.groupId,
        deliveryTime: budget.deliveryTime,
        warranty: budget.warranty,
        warrantyMonths: budget.warrantyMonths,
        shippingCost: budget.shippingCost ? parseFloat(budget.shippingCost) : 0,
        reclameAquiScore: budget.reclameAquiScore,
        productRating: budget.productRating,
        depreciation: budget.depreciation,
        riskFactors: budget.riskFactors || []
      });
    });
    
    // Filtrar apenas grupos com pelo menos 2 orçamentos
    const validGroups = {};
    Object.entries(budgetGroups).forEach(([key, budgets]) => {
      if (budgets.length >= 2) {
        // Usar o título do primeiro orçamento como chave do grupo
        validGroups[budgets[0].title] = budgets;
      }
    });
    
    // Estruturar resposta
    const response = {
      groups: validGroups,
      totalGroups: Object.keys(validGroups).length
    };
    
    res.status(200).json({
      success: true,
      message: 'Grupos de orçamentos obtidos com sucesso',
      data: response
    });
  } catch (error) {
    logger.error('Erro ao obter grupos de orçamentos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao obter grupos de orçamentos',
      error: error.message
    });
  }
};

/**
 * Criar ou atualizar grupo de orçamentos
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 */
exports.updateBudgetGroup = async (req, res) => {
  try {
    const { budgetIds, groupId, groupName } = req.body;
    const userId = req.user.id;
    
    if (!budgetIds || !Array.isArray(budgetIds) || budgetIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'É necessário fornecer pelo menos um ID de orçamento'
      });
    }
    
    // Verificar se todos os orçamentos pertencem ao usuário
    const budgets = await BudgetRecord.findAll({
      where: { 
        id: { [Op.in]: budgetIds },
        userId
      }
    });
    
    if (budgets.length !== budgetIds.length) {
      return res.status(403).json({
        success: false,
        message: 'Um ou mais orçamentos não foram encontrados ou não pertencem ao usuário'
      });
    }
    
    // Gerar um novo groupId se não fornecido
    const finalGroupId = groupId || `${groupName || budgets[0].title}-${uuidv4().substring(0, 8)}`;
    
    // Atualizar o groupId de todos os orçamentos
    await Promise.all(budgets.map(budget => 
      budget.update({ groupId: finalGroupId })
    ));
    
    // Gerar análise de IA para o grupo se houver pelo menos 2 orçamentos
    let aiAnalysis = null;
    if (budgets.length >= 2) {
      try {
        const groupData = {
          records: budgets,
          summary: {
            totalBudgets: budgets.length,
            totalAmount: budgets.reduce((sum, b) => sum + parseFloat(b.totalAmount || 0), 0)
          }
        };
        
        aiAnalysis = await aiController.generateBudgetComparisonInternal(groupData);
      } catch (aiError) {
        logger.error('Erro ao gerar análise de IA para grupo de orçamentos:', aiError);
      }
    }
    
    res.status(200).json({
      success: true,
      message: 'Grupo de orçamentos atualizado com sucesso',
      data: {
        groupId: finalGroupId,
        budgetIds,
        aiAnalysis
      }
    });
  } catch (error) {
    logger.error('Erro ao atualizar grupo de orçamentos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar grupo de orçamentos',
      error: error.message
    });
  }
};

/**
 * Adicionar orçamento a um grupo existente
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 */
exports.addBudgetToGroup = async (req, res) => {
  try {
    const { budgetId, groupId } = req.body;
    const userId = req.user.id;
    
    if (!budgetId || !groupId) {
      return res.status(400).json({
        success: false,
        message: 'É necessário fornecer o ID do orçamento e o ID do grupo'
      });
    }
    
    // Verificar se o orçamento pertence ao usuário
    const budget = await BudgetRecord.findOne({
      where: { 
        id: budgetId,
        userId
      }
    });
    
    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Orçamento não encontrado ou não pertence ao usuário'
      });
    }
    
    // Verificar se o grupo existe
    const groupBudgets = await BudgetRecord.findAll({
      where: { 
        groupId,
        userId
      }
    });
    
    if (groupBudgets.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Grupo não encontrado'
      });
    }
    
    // Atualizar o groupId do orçamento
    await budget.update({ groupId });
    
    res.status(200).json({
      success: true,
      message: 'Orçamento adicionado ao grupo com sucesso',
      data: {
        budgetId,
        groupId
      }
    });
  } catch (error) {
    logger.error('Erro ao adicionar orçamento ao grupo:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao adicionar orçamento ao grupo',
      error: error.message
    });
  }
};

/**
 * Remover orçamento de um grupo
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 */
exports.removeBudgetFromGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Verificar se o orçamento pertence ao usuário
    const budget = await BudgetRecord.findOne({
      where: { 
        id,
        userId
      }
    });
    
    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Orçamento não encontrado ou não pertence ao usuário'
      });
    }
    
    // Verificar se o orçamento está em um grupo
    if (!budget.groupId) {
      return res.status(400).json({
        success: false,
        message: 'Orçamento não está em nenhum grupo'
      });
    }
    
    // Remover o groupId do orçamento
    await budget.update({ groupId: null });
    
    res.status(200).json({
      success: true,
      message: 'Orçamento removido do grupo com sucesso',
      data: {
        budgetId: id
      }
    });
  } catch (error) {
    logger.error('Erro ao remover orçamento do grupo:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao remover orçamento do grupo',
      error: error.message
    });
  }
};
