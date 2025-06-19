/**
 * Modelo de Cliente
 * 
 * Este modelo define a estrutura da tabela de clientes no banco de dados.
 * Representa o perfil completo de um usuário com papel de cliente.
 * 
 * @author Doc.AI Team
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Client = sequelize.define('Client', {
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
    },
    unique: true
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  birthDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true
  },
  zipCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Brasil'
  },
  profession: {
    type: DataTypes.STRING,
    allowNull: true
  },
  company: {
    type: DataTypes.STRING,
    allowNull: true
  },
  documentCategories: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  notificationPreferences: {
    type: DataTypes.JSONB,
    defaultValue: {
      email: true,
      push: false,
      sms: false,
      documentUpdates: true,
      securityAlerts: true,
      marketingEmails: false
    }
  },
  onboardingCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  referralCode: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  referredBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Clients',
      key: 'id'
    }
  }
}, {
  tableName: 'Clients'
});

module.exports = Client;
