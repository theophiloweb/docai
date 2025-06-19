/**
 * Modelo de Assinatura
 * 
 * Este modelo define a estrutura da tabela de assinaturas no banco de dados.
 * 
 * @author Doc.AI Team
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Subscription = sequelize.define('Subscription', {
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
  planId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Plans',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'canceled', 'expired', 'trial'),
    defaultValue: 'active'
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  renewalDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  canceledAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true
  },
  paymentDetails: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  usageData: {
    type: DataTypes.JSONB,
    defaultValue: {
      storageUsed: 0,
      documentsUploaded: 0,
      aiAnalysisUsed: 0
    }
  }
}, {
  tableName: 'Subscriptions'
});

module.exports = Subscription;
