/**
 * Modelo de Usuário
 * 
 * Este modelo define a estrutura da tabela de usuários no banco de dados,
 * incluindo validações e hooks para garantir a segurança dos dados.
 * 
 * @author Doc.AI Team
 */

const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');
const { encrypt, decrypt } = require('../utils/encryption');

class User extends Model {}

User.init({
  // ID único do usuário
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  
  // Nome completo do usuário
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'O nome é obrigatório'
      },
      len: {
        args: [3, 100],
        msg: 'O nome deve ter entre 3 e 100 caracteres'
      }
    }
  },
  
  // Email do usuário (único)
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: {
      name: 'users_email_unique',
      msg: 'Este email já está em uso'
    },
    validate: {
      isEmail: {
        msg: 'Email inválido'
      },
      notEmpty: {
        msg: 'O email é obrigatório'
      }
    },
    set(value) {
      // Armazenar email em minúsculas
      this.setDataValue('email', value.toLowerCase());
    }
  },
  
  // Hash da senha
  password: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'A senha é obrigatória'
      }
    }
  },
  
  // Função do usuário (comum, admin)
  role: {
    type: DataTypes.ENUM('comum', 'admin'),
    allowNull: false,
    defaultValue: 'comum'
  },
  
  // Status de ativação da conta
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  
  // Data da última alteração de senha
  password_changed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  // Token para redefinição de senha
  password_reset_token: {
    type: DataTypes.STRING,
    allowNull: true
  },
  
  // Data de expiração do token de redefinição de senha
  password_reset_expires: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  // Número de tentativas de login malsucedidas
  login_attempts: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  
  // Data até a qual a conta está bloqueada
  locked_until: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  // Segredo para autenticação em dois fatores
  two_factor_secret: {
    type: DataTypes.STRING,
    allowNull: true,
    get() {
      const value = this.getDataValue('two_factor_secret');
      return value ? decrypt(value) : null;
    },
    set(value) {
      this.setDataValue('two_factor_secret', value ? encrypt(value) : null);
    }
  },
  
  // Status de ativação da autenticação em dois fatores
  two_factor_enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  
  // Backup codes para autenticação em dois fatores
  two_factor_backup_codes: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('two_factor_backup_codes');
      return value ? JSON.parse(decrypt(value)) : null;
    },
    set(value) {
      this.setDataValue(
        'two_factor_backup_codes', 
        value ? encrypt(JSON.stringify(value)) : null
      );
    }
  },
  
  // Data do último login
  last_login_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  // Endereço IP do último login
  last_login_ip: {
    type: DataTypes.STRING,
    allowNull: true
  },
  
  // Preferências do usuário (tema, idioma, etc.)
  preferences: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {
      theme: 'light',
      language: 'pt-BR',
      notifications: {
        email: true,
        push: false
      }
    }
  },
  
  // Termos de uso aceitos
  // Implementando registro de consentimento conforme Art. 8 da LGPD
  terms_accepted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  
  // Versão dos termos aceitos
  terms_version: {
    type: DataTypes.STRING,
    allowNull: true
  },
  
  // Data de aceitação dos termos
  terms_accepted_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  // Consentimentos específicos do usuário
  // Implementando registro de consentimento conforme Art. 8 da LGPD
  consents: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {
      marketing_emails: false,
      data_processing: true,
      third_party_sharing: false
    }
  }
}, {
  sequelize,
  modelName: 'user',
  tableName: 'users',
  underscored: true,
  timestamps: true,
  
  // Hooks para processamento antes/depois de operações
  hooks: {
    // Hash da senha antes de criar o usuário
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    
    // Hash da senha antes de atualizar o usuário (se a senha foi alterada)
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        user.password_changed_at = new Date();
      }
    }
  }
});

/**
 * Método para verificar se a senha fornecida corresponde à senha do usuário
 * 
 * @param {string} candidatePassword - Senha a ser verificada
 * @returns {Promise<boolean>} - Verdadeiro se a senha corresponder
 */
User.prototype.correctPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Método para verificar se o token de redefinição de senha é válido
 * 
 * @returns {boolean} - Verdadeiro se o token for válido e não expirado
 */
User.prototype.isPasswordResetTokenValid = function() {
  return this.password_reset_token && 
         this.password_reset_expires && 
         new Date() < this.password_reset_expires;
};

/**
 * Método para verificar se a conta está bloqueada
 * 
 * @returns {boolean} - Verdadeiro se a conta estiver bloqueada
 */
User.prototype.isAccountLocked = function() {
  return this.locked_until && new Date() < this.locked_until;
};

/**
 * Método para incrementar o contador de tentativas de login
 * e bloquear a conta se necessário
 * 
 * @returns {Promise<void>}
 */
User.prototype.incrementLoginAttempts = async function() {
  this.login_attempts += 1;
  
  // Bloquear a conta após 3 tentativas malsucedidas
  if (this.login_attempts >= 3) {
    // Bloquear por 15 minutos
    const lockUntil = new Date();
    lockUntil.setMinutes(lockUntil.getMinutes() + 15);
    this.locked_until = lockUntil;
  }
  
  await this.save();
};

/**
 * Método para resetar o contador de tentativas de login
 * 
 * @returns {Promise<void>}
 */
User.prototype.resetLoginAttempts = async function() {
  this.login_attempts = 0;
  this.locked_until = null;
  await this.save();
};

module.exports = User;
