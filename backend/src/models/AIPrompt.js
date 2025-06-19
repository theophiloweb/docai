/**
 * Modelo de Prompt de IA
 * 
 * Este modelo define a estrutura da tabela de prompts de IA no banco de dados.
 * 
 * @author Doc.AI Team
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AIPrompt = sequelize.define('AIPrompt', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  prompt: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'general_analysis'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'AIPrompts'
});

module.exports = AIPrompt;
