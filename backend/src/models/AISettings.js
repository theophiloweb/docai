/**
 * Modelo de Configurações de IA
 * 
 * Este modelo define a estrutura da tabela de configurações de IA no banco de dados.
 * 
 * @author Doc.AI Team
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AISettings = sequelize.define('AISettings', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: false
  },
  apiKey: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'api_key'
  },
  apiUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'api_url'
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false
  },
  maxTokens: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1000,
    field: 'max_tokens'
  },
  temperature: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.7
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  },
  settings: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  usageLimit: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'usage_limit'
  },
  usageCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'usage_count'
  },
  lastUsed: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'last_used'
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'updated_at'
  }
}, {
  tableName: 'AISettings'
});

module.exports = AISettings;
