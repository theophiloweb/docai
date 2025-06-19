/**
 * Modelo de Configurações do Sistema
 * 
 * Este modelo define a estrutura da tabela de configurações do sistema no banco de dados.
 * 
 * @author Doc.AI Team
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SystemSettings = sequelize.define('SystemSettings', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'string'
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'general'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'SystemSettings'
});

module.exports = SystemSettings;
