/**
 * Modelo de Registro de Orçamento
 * 
 * Este modelo define a estrutura da tabela de registros de orçamentos extraídos de documentos.
 * 
 * @author Doc.AI Team
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BudgetRecord = sequelize.define('BudgetRecord', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  documentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Documents',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: true
  },
  providerCNPJ: {
    type: DataTypes.STRING,
    allowNull: true
  },
  issueDate: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  },
  validUntil: {
    type: DataTypes.DATE,
    allowNull: true
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'BRL'
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pendente', 'aprovado', 'recusado', 'fechado'),
    allowNull: true,
    defaultValue: 'pendente'
  },
  items: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
    // Exemplo: [{ "descricao": "Serviço 1", "quantidade": 1, "valorUnitario": 500.00, "valorTotal": 500.00 }]
  },
  paymentTerms: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  deliveryTerms: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  contactInfo: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
    // Exemplo: { "nome": "João Silva", "email": "joao@empresa.com", "telefone": "(11) 98765-4321" }
  },
  competingQuotes: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
    // Exemplo: [{ "provider": "Empresa B", "amount": 550.00 }, { "provider": "Empresa C", "amount": 480.00 }]
  },
  groupId: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Identificador do grupo de orçamentos relacionados ao mesmo produto/serviço'
  },
  productDetails: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {},
    comment: 'Detalhes específicos do produto como marca, modelo, especificações técnicas'
  },
  deliveryTime: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Tempo de entrega em dias'
  },
  warranty: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Período de garantia (ex: "12 meses")'
  },
  warrantyMonths: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Período de garantia em meses para facilitar comparações'
  },
  shippingCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
    comment: 'Custo de frete'
  },
  reclameAquiScore: {
    type: DataTypes.FLOAT,
    allowNull: true,
    comment: 'Pontuação do fornecedor no ReclameAqui (0-10)'
  },
  productRating: {
    type: DataTypes.FLOAT,
    allowNull: true,
    comment: 'Avaliação média do produto (0-5)'
  },
  depreciation: {
    type: DataTypes.FLOAT,
    allowNull: true,
    comment: 'Taxa de depreciação anual estimada em porcentagem'
  },
  riskFactors: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: [],
    comment: 'Fatores de risco identificados pela IA'
  },
  rawText: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  aiAnalysis: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  aiRecommendation: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  aiComparison: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'BudgetRecords',
  underscored: true,
  indexes: [
    {
      name: 'idx_budget_records_user_id',
      fields: ['user_id']
    },
    {
      name: 'idx_budget_records_document_id',
      fields: ['document_id']
    },
    {
      name: 'idx_budget_records_issue_date',
      fields: ['issue_date']
    },
    {
      name: 'idx_budget_records_status',
      fields: ['status']
    },
    {
      name: 'idx_budget_records_category',
      fields: ['category']
    },
    {
      name: 'idx_budget_records_group_id',
      fields: ['group_id']
    }
  ]
});

module.exports = BudgetRecord;
