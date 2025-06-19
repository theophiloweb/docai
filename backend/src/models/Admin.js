/**
 * Modelo de Administrador
 * 
 * Este modelo define a estrutura da tabela de administradores no banco de dados.
 * Representa o perfil completo de um usuário com papel de administrador.
 * 
 * @author Doc.AI Team
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Admin = sequelize.define('Admin', {
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
    unique: true,
    field: 'user_id'
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'full_name'
  },
  position: {
    type: DataTypes.STRING,
    allowNull: true
  },
  department: {
    type: DataTypes.STRING,
    allowNull: true
  },
  employeeId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    field: 'employee_id'
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  permissions: {
    type: DataTypes.JSONB,
    defaultValue: {
      users: true,
      documents: true,
      plans: true,
      settings: true,
      logs: true,
      reports: true,
      api: false
    }
  },
  isSuperAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_super_admin'
  },
  lastActivity: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'last_activity'
  },
  activityLog: {
    type: DataTypes.JSONB,
    defaultValue: [],
    field: 'activity_log'
  }
}, {
  tableName: 'Admins',
  underscored: true
});

module.exports = Admin;
