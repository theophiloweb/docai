/**
 * Modelo de Registro Financeiro
 * 
 * Este modelo define a estrutura da tabela de registros financeiros extraídos de documentos.
 * 
 * @author Doc.AI Team
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const FinancialRecord = sequelize.define('FinancialRecord', {
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
  recordType: {
    type: DataTypes.ENUM('fatura', 'nota_fiscal', 'cupom_fiscal', 'extrato_bancario', 'comprovante_pagamento', 'recibo', 'outro'),
    allowNull: true,
    defaultValue: 'outro'
  },
  documentType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  documentDate: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  },
  transactionDate: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0
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
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  subcategory: {
    type: DataTypes.STRING,
    allowNull: true
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true
  },
  establishment: {
    type: DataTypes.STRING,
    allowNull: true
  },
  issuer: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cnpj: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'pending'
  },
  items: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
    // Exemplo: [{ "nome": "Produto 1", "quantidade": 2, "valorUnitario": 10.50, "valorTotal": 21.00 }]
  },
  taxes: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
    // Exemplo: { "icms": 5.20, "iss": 2.10, "pis": 0.65 }
  },
  isExpense: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  },
  isRecurring: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  recurrencePattern: {
    type: DataTypes.STRING,
    allowNull: true
  },
  rawText: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  aiAnalysis: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  aiTrends: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'FinancialRecords',
  underscored: true,
  indexes: [
    {
      name: 'idx_financial_records_user_id',
      fields: ['user_id']
    },
    {
      name: 'idx_financial_records_document_id',
      fields: ['document_id']
    },
    {
      name: 'idx_financial_records_record_type',
      fields: ['record_type']
    },
    {
      name: 'idx_financial_records_transaction_date',
      fields: ['transaction_date']
    },
    {
      name: 'idx_financial_records_category',
      fields: ['category']
    }
  ]
});

module.exports = FinancialRecord;
