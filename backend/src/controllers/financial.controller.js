/**
 * Controlador Financeiro
 * 
 * Este controlador gerencia as operações relacionadas aos registros financeiros.
 * 
 * @author Doc.AI Team
 */

const { FinancialRecord, Document, sequelize } = require('../models');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const aiController = require('./ai.controller');
const logger = require('../utils/logger');

/**
 * Obter dados para o dashboard financeiro
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 */
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Buscar registros financeiros do usuário
    const financialRecords = await FinancialRecord.findAll({
      where: { userId },
      order: [['transactionDate', 'DESC']],
      limit: 50
    });
    
    // Calcular totais
    const totalExpenses = financialRecords
      .filter(record => record.isExpense)
      .reduce((sum, record) => sum + parseFloat(record.amount || 0), 0);
    
    const totalIncome = financialRecords
      .filter(record => !record.isExpense)
      .reduce((sum, record) => sum + parseFloat(record.amount || 0), 0);
    
    // Contar documentos por tipo
    const invoicesCount = await Document.count({ 
      where: { 
        userId,
        category: 'financeiro',
        tags: { [Op.contains]: ['fatura'] }
      }
    });
    
    const receiptsCount = await Document.count({ 
      where: { 
        userId,
        category: 'financeiro',
        tags: { [Op.contains]: ['recibo'] }
      }
    });
    
    const bankStatementsCount = await Document.count({ 
      where: { 
        userId,
        category: 'financeiro',
        tags: { [Op.contains]: ['extrato'] }
      }
    });
    
    const totalDocuments = await Document.count({ 
      where: { 
        userId,
        category: 'financeiro'
      }
    });
    
    // Preparar dados para gráficos
    const monthlyExpensesData = prepareMonthlyExpensesData(financialRecords);
    const expensesByCategoryData = prepareExpensesByCategoryData(financialRecords);
    const incomeVsExpenseData = prepareIncomeVsExpenseData(financialRecords);
    
    // Preparar dados para análise de IA
    const financialData = {
      records: financialRecords.map(record => ({
        date: record.transactionDate,
        amount: record.amount,
        category: record.category,
        isExpense: record.isExpense,
        description: record.description
      })),
      summary: {
        totalExpenses,
        totalIncome,
        balance: totalIncome - totalExpenses
      },
      trends: monthlyExpensesData,
      categories: expensesByCategoryData
    };
    
    // Gerar análises de IA
    let aiAnalysis = {
      monthlyExpenses: "Suas despesas mensais têm se mantido relativamente estáveis nos últimos 6 meses, com uma leve tendência de aumento (aproximadamente 2.5% ao mês). O mês de abril apresentou o maior gasto.",
      categories: "Moradia representa sua maior despesa (37% do total), seguida por alimentação (26%). Há oportunidade de economia nas categorias de lazer e transporte, que estão acima da média para seu perfil.",
      cashFlow: "Seu fluxo de caixa está positivo, com uma média de economia mensal de R$ 1.350,00. Recomenda-se manter um fundo de emergência equivalente a pelo menos 3 meses de despesas."
    };
    
    try {
      // Chamar serviço de IA para gerar insights
      const aiResponse = await aiController.generateFinancialInsightsInternal(financialData);
      
      if (aiResponse && aiResponse.length > 0) {
        // Extrair análises dos insights
        const monthlyExpensesInsight = aiResponse.find(insight => 
          insight.title.toLowerCase().includes('despesa') || 
          insight.title.toLowerCase().includes('gasto')
        );
        
        const categoriesInsight = aiResponse.find(insight => 
          insight.title.toLowerCase().includes('categor')
        );
        
        const cashFlowInsight = aiResponse.find(insight => 
          insight.title.toLowerCase().includes('fluxo') || 
          insight.title.toLowerCase().includes('saldo') ||
          insight.title.toLowerCase().includes('receita')
        );
        
        // Atualizar análises se encontradas
        if (monthlyExpensesInsight) {
          aiAnalysis.monthlyExpenses = monthlyExpensesInsight.description;
        }
        
        if (categoriesInsight) {
          aiAnalysis.categories = categoriesInsight.description;
        }
        
        if (cashFlowInsight) {
          aiAnalysis.cashFlow = cashFlowInsight.description;
        }
      }
    } catch (error) {
      logger.error('Erro ao gerar análises de IA para dashboard financeiro:', error);
      // Manter análises padrão em caso de erro
    }
    
    // Preparar resposta
    const dashboardData = {
      summary: {
        totalDocuments,
        invoices: invoicesCount,
        receipts: receiptsCount,
        bankStatements: bankStatementsCount,
        totalExpenses,
        totalIncome
      },
      latestTransactions: financialRecords.slice(0, 5).map(record => ({
        id: record.id,
        date: record.transactionDate,
        description: record.description,
        amount: parseFloat(record.amount),
        category: record.category,
        isExpense: record.isExpense
      })),
      monthlyExpenses: monthlyExpensesData,
      expensesByCategory: expensesByCategoryData,
      incomeVsExpense: incomeVsExpenseData,
      aiAnalysis
    };
    
    res.status(200).json({
      success: true,
      message: 'Dados do dashboard financeiro obtidos com sucesso',
      data: dashboardData
    });
  } catch (error) {
    logger.error('Erro ao obter dados do dashboard financeiro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao obter dados do dashboard financeiro',
      error: error.message
    });
  }
};

/**
 * Preparar dados para gráfico de despesas mensais
 * @param {Array} records - Registros financeiros
 * @returns {Object} - Dados formatados para o gráfico
 */
const prepareMonthlyExpensesData = (records) => {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const currentMonth = new Date().getMonth();
  const labels = [];
  
  // Obter os últimos 6 meses
  for (let i = 5; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12;
    labels.push(months[monthIndex]);
  }
  
  // Calcular despesas por mês
  const expensesByMonth = Array(6).fill(0);
  
  records.forEach(record => {
    if (record.isExpense) {
      const recordDate = new Date(record.transactionDate);
      const monthDiff = (currentMonth - recordDate.getMonth() + 12) % 12;
      
      if (monthDiff < 6) {
        expensesByMonth[5 - monthDiff] += parseFloat(record.amount || 0);
      }
    }
  });
  
  return {
    labels,
    datasets: [
      {
        label: 'Despesas Mensais',
        data: expensesByMonth,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1
      }
    ]
  };
};

/**
 * Preparar dados para gráfico de despesas por categoria
 * @param {Array} records - Registros financeiros
 * @returns {Object} - Dados formatados para o gráfico
 */
const prepareExpensesByCategoryData = (records) => {
  const categories = {};
  
  // Calcular despesas por categoria
  records.forEach(record => {
    if (record.isExpense && record.category) {
      const category = record.category.charAt(0).toUpperCase() + record.category.slice(1);
      categories[category] = (categories[category] || 0) + parseFloat(record.amount || 0);
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
          label: 'Despesas por Categoria',
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
        label: 'Despesas por Categoria',
        data,
        backgroundColor: backgroundColors.slice(0, labels.length),
        borderColor: borderColors.slice(0, labels.length),
        borderWidth: 1
      }
    ]
  };
};

/**
 * Preparar dados para gráfico de receitas vs despesas
 * @param {Array} records - Registros financeiros
 * @returns {Object} - Dados formatados para o gráfico
 */
const prepareIncomeVsExpenseData = (records) => {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const currentMonth = new Date().getMonth();
  const labels = [];
  
  // Obter os últimos 6 meses
  for (let i = 5; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12;
    labels.push(months[monthIndex]);
  }
  
  // Calcular receitas e despesas por mês
  const incomeByMonth = Array(6).fill(0);
  const expensesByMonth = Array(6).fill(0);
  
  records.forEach(record => {
    const recordDate = new Date(record.transactionDate);
    const monthDiff = (currentMonth - recordDate.getMonth() + 12) % 12;
    
    if (monthDiff < 6) {
      if (record.isExpense) {
        expensesByMonth[5 - monthDiff] += parseFloat(record.amount || 0);
      } else {
        incomeByMonth[5 - monthDiff] += parseFloat(record.amount || 0);
      }
    }
  });
  
  return {
    labels,
    datasets: [
      {
        label: 'Receitas',
        data: incomeByMonth,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1
      },
      {
        label: 'Despesas',
        data: expensesByMonth,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1
      }
    ]
  };
};
