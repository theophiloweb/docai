/**
 * Modelo de Log
 * 
 * Este modelo define a estrutura da tabela de logs no banco de dados.
 * 
 * @author Doc.AI Team
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Log = sequelize.define('Log', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  level: {
    type: DataTypes.ENUM('info', 'warning', 'error'),
    defaultValue: 'info'
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  details: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  ip: {
    type: DataTypes.STRING,
    allowNull: true
  },
  userAgent: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'Logs'
});

module.exports = Log;
