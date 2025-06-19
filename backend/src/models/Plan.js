/**
 * Modelo de Plano
 * 
 * Este modelo define a estrutura da tabela de planos no banco de dados.
 * 
 * @author Doc.AI Team
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Plan = sequelize.define('Plan', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  billingCycle: {
    type: DataTypes.ENUM('monthly', 'yearly'),
    defaultValue: 'monthly',
    field: 'billing_cycle'
  },
  features: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  storageLimit: {
    type: DataTypes.INTEGER, // em MB
    allowNull: false,
    field: 'storage_limit'
  },
  documentLimit: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'document_limit'
  },
  aiAnalysisLimit: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'ai_analysis_limit'
  },
  isPopular: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_popular'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'display_order'
  }
}, {
  tableName: 'Plans',
  underscored: true
});

module.exports = Plan;
