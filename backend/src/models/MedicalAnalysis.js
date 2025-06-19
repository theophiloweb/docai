/**
 * Modelo de Análise Médica por IA
 * 
 * Este modelo define a estrutura da tabela de análises médicas geradas por IA.
 * 
 * @author Doc.AI Team
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MedicalAnalysis = sequelize.define('MedicalAnalysis', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  analysisType: {
    type: DataTypes.ENUM('vitalSigns', 'labResults', 'general', 'trends'),
    allowNull: false
  },
  analysisDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  dataHash: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Hash dos dados analisados para verificar se houve mudanças'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  },
  aiProvider: {
    type: DataTypes.STRING,
    allowNull: true
  },
  aiModel: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'MedicalAnalyses',
  underscored: true,
  indexes: [
    {
      name: 'idx_medical_analyses_user_id',
      fields: ['user_id']
    },
    {
      name: 'idx_medical_analyses_analysis_type',
      fields: ['analysis_type']
    },
    {
      name: 'idx_medical_analyses_data_hash',
      fields: ['data_hash']
    },
    {
      name: 'idx_medical_analyses_analysis_date',
      fields: ['analysis_date']
    }
  ]
});

module.exports = MedicalAnalysis;
