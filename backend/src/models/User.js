/**
 * Modelo de Usuário
 * 
 * Este modelo define a estrutura da tabela de usuários no banco de dados.
 * 
 * @author Doc.AI Team
 */

const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user'
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'blocked'),
    defaultValue: 'active'
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  verificationToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resetPasswordExpires: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  },
  preferences: {
    type: DataTypes.JSONB,
    defaultValue: {
      theme: 'light',
      language: 'pt-BR',
      notifications: {
        email: true,
        push: false
      }
    }
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'Users',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
});

// Método para verificar senha
User.prototype.checkPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Método para gerar token de verificação de email
User.prototype.generateVerificationToken = function() {
  this.verificationToken = require('crypto').randomBytes(32).toString('hex');
  return this.verificationToken;
};

// Método para gerar token de redefinição de senha
User.prototype.generatePasswordResetToken = function() {
  this.resetPasswordToken = require('crypto').randomBytes(32).toString('hex');
  this.resetPasswordExpires = Date.now() + 3600000; // 1 hora
  return this.resetPasswordToken;
};

module.exports = User;
