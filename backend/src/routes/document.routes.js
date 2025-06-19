/**
 * Rotas de documentos
 * 
 * Este arquivo define as rotas relacionadas aos documentos.
 * 
 * @author Doc.AI Team
 */

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { Document, MedicalRecord, FinancialRecord, BudgetRecord } = require('../models');
const { v4: uuidv4 } = require('uuid');

// Aplicar middleware de autenticação a todas as rotas
router.use(authMiddleware);

// Função auxiliar para formatar valores monetários
const formatCurrency = (value) => {
  if (value === undefined || value === null) return 'R$ 0,00';
  
  try {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  } catch (error) {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  }
};

/**
 * @route GET /api/documents/dashboard
 * @desc Obter dados para o dashboard principal
 * @access Private
 */
const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Buscar documentos do usuário
    let documents = [];
    try {
      documents = await Document.findAll({
        where: { userId: userId }, // Sequelize mapeia corretamente userId para user_id
        order: [['createdAt', 'DESC']],
        // Não usar raw: true!
      });
      // Removido o log que exibia detalhes dos documentos
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
      // Continuar com documentos vazios
    }

    // Contar documentos por categoria
    const categories = {};
    documents.forEach(doc => {
      categories[doc.category] = (categories[doc.category] || 0) + 1;
    });

    // Calcular tamanho total de armazenamento
    const totalStorage = documents.reduce((sum, doc) => sum + (doc.fileSize || 0), 0);
    const storageUsed = (totalStorage / (1024 * 1024)).toFixed(2) + ' MB';

    // Buscar dados médicos
    let medicalSummary = {
      totalDocuments: 0,
      lastConsultation: null
    };

    try {
      const medicalRecords = await MedicalRecord.findAll({
        where: { userId },
        order: [['recordDate', 'DESC']]
      });

      const lastConsultation = medicalRecords.find(record => record.recordType === 'consulta');
      
      medicalSummary = {
        totalDocuments: medicalRecords.length,
        lastConsultation: lastConsultation ? {
          date: lastConsultation.recordDate,
          doctorName: lastConsultation.doctorName,
          specialty: lastConsultation.specialty
        } : null
      };
    } catch (error) {
      console.error('Erro ao buscar dados médicos:', error);
      // Continuar com dados padrão
    }

    // Buscar dados financeiros
    let financialSummary = {
      totalDocuments: 0,
      totalExpenses: 0,
      totalIncome: 0
    };

    try {
      const financialRecords = await FinancialRecord.findAll({
        where: { userId }
      });

      const totalExpenses = financialRecords
        .filter(record => record.isExpense)
        .reduce((sum, record) => sum + parseFloat(record.amount || 0), 0);
      
      const totalIncome = financialRecords
        .filter(record => !record.isExpense)
        .reduce((sum, record) => sum + parseFloat(record.amount || 0), 0);
      
      financialSummary = {
        totalDocuments: financialRecords.length,
        totalExpenses,
        totalIncome
      };
    } catch (error) {
      console.error('Erro ao buscar dados financeiros:', error);
      // Continuar com dados padrão
    }

    // Buscar dados de orçamentos
    let budgetSummary = {
      totalBudgets: 0,
      pendingBudgets: 0,
      totalAmount: 0
    };

    try {
      const budgetRecords = await BudgetRecord.findAll({
        where: { userId }
      });

      const pendingBudgets = budgetRecords.filter(record => record.status === 'pendente').length;
      const totalAmount = budgetRecords.reduce((sum, record) => sum + parseFloat(record.totalAmount || 0), 0);
      
      budgetSummary = {
        totalBudgets: budgetRecords.length,
        pendingBudgets,
        totalAmount
      };
    } catch (error) {
      console.error('Erro ao buscar dados de orçamentos:', error);
      // Continuar com dados padrão
    }

    // Preparar documentos recentes
    const recentDocuments = documents.slice(0, 4).map(doc => ({
      id: doc.id,
      title: doc.title,
      description: doc.description,
      category: doc.category,
      createdAt: doc.createdAt
    }));

    // Buscar insights do banco de dados em vez de usar dados estáticos
    let insights = [];
    try {
      // Aqui você pode implementar a lógica para buscar insights reais do banco de dados
      // Por exemplo, através de uma tabela de Insights ou gerando-os dinamicamente
      // com base nos dados do usuário
      
      // Por enquanto, vamos usar os dados do banco que já temos para gerar insights relevantes
      if (medicalSummary.lastConsultation) {
        insights.push({
          id: uuidv4 ? uuidv4() : 'med-1',
          title: 'Consulta médica recente',
          description: `Você teve uma consulta com ${medicalSummary.lastConsultation.doctorName} recentemente.`,
          category: 'medical',
          createdAt: new Date().toISOString()
        });
      }
      
      if (financialSummary.totalExpenses > 0) {
        insights.push({
          id: uuidv4 ? uuidv4() : 'fin-1',
          title: 'Análise de despesas',
          description: `Suas despesas totais são de ${formatCurrency(financialSummary.totalExpenses)}.`,
          category: 'financial',
          createdAt: new Date().toISOString()
        });
      }
      
      if (budgetSummary.pendingBudgets > 0) {
        insights.push({
          id: uuidv4 ? uuidv4() : 'bud-1',
          title: 'Orçamentos pendentes',
          description: `Você tem ${budgetSummary.pendingBudgets} orçamentos pendentes para análise.`,
          category: 'budget',
          createdAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Erro ao gerar insights:', error);
      insights = []; // Em caso de erro, não exibir insights
    }

    // Retornar dados para o dashboard
    res.status(200).json({
      success: true,
      data: {
        documentCount: documents.length,
        categoryCount: Object.keys(categories).length,
        storageUsed,
        recentDocuments,
        insights,
        medicalSummary,
        financialSummary,
        budgetSummary
      }
    });
  } catch (error) {
    console.error('Erro ao obter dados do dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao obter dados do dashboard',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Função para listar documentos
const listDocuments = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Obter parâmetros de paginação
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Buscar documentos com paginação
    const { count, rows: documents } = await Document.findAndCountAll({
      where: { userId: userId },
      order: [['createdAt', 'DESC']],
      limit: limit,
      offset: offset
    });
    
    // Calcular total de páginas
    const totalPages = Math.ceil(count / limit);
    
    res.status(200).json({
      success: true,
      data: {
        documents,
        total: count,
        page: page,
        limit: limit,
        totalPages: totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Erro ao listar documentos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar documentos',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Função para obter um documento
const getDocument = async (req, res) => {
  try {
    const userId = req.user.id;
    const documentId = req.params.id;
    
    // Buscar documento do banco de dados
    const document = await Document.findOne({
      where: { 
        id: documentId,
        userId: userId
      }
    });
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Documento não encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        document
      }
    });
  } catch (error) {
    console.error('Erro ao obter documento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao obter documento',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Função para criar um documento
const createDocument = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, category, content } = req.body;
    
    // Criar documento no banco de dados
    const document = await Document.create({
      userId,
      title: title || 'Novo Documento',
      description: description || '',
      category: category || 'outro',
      content: content || '',
      fileSize: 0, // Definir tamanho apropriado se houver upload de arquivo
      fileType: 'text/plain',
      status: 'active'
    });
    
    res.status(201).json({
      success: true,
      message: 'Documento criado com sucesso',
      data: {
        document
      }
    });
  } catch (error) {
    console.error('Erro ao criar documento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar documento',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Função para atualizar um documento
const updateDocument = async (req, res) => {
  try {
    const userId = req.user.id;
    const documentId = req.params.id;
    const { title, description, category, content, status } = req.body;
    
    // Buscar documento
    const document = await Document.findOne({
      where: { 
        id: documentId,
        userId: userId
      }
    });
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Documento não encontrado'
      });
    }
    
    // Atualizar documento
    await document.update({
      title: title !== undefined ? title : document.title,
      description: description !== undefined ? description : document.description,
      category: category !== undefined ? category : document.category,
      content: content !== undefined ? content : document.content,
      status: status !== undefined ? status : document.status
    });
    
    res.status(200).json({
      success: true,
      message: 'Documento atualizado com sucesso',
      data: {
        document
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar documento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar documento',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Função para excluir um documento
const deleteDocument = async (req, res) => {
  try {
    const userId = req.user.id;
    const documentId = req.params.id;
    
    // Buscar documento
    const document = await Document.findOne({
      where: { 
        id: documentId,
        userId: userId
      }
    });
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Documento não encontrado'
      });
    }
    
    // Excluir documento (ou marcar como excluído)
    await document.destroy();
    // Alternativa: await document.update({ status: 'deleted' });
    
    res.status(200).json({
      success: true,
      message: 'Documento excluído com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir documento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao excluir documento',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Rotas
router.get('/dashboard', getDashboardData);
router.get('/', listDocuments);
router.get('/:id', getDocument);
router.post('/', createDocument);
router.put('/:id', updateDocument);
router.delete('/:id', deleteDocument);

module.exports = router;
