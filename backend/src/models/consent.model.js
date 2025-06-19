/**
 * Modelo de Consentimento
 * 
 * Este modelo define a estrutura da tabela de consentimentos no banco de dados,
 * implementando o registro de consentimento conforme Art. 8 da LGPD.
 * 
 * @author Doc.AI Team
 */

const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./user.model');

class Consent extends Model {}

Consent.init({
  // ID único do registro de consentimento
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  
  // ID do usuário que forneceu o consentimento
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  
  // Tipo de consentimento
  consent_type: {
    type: DataTypes.ENUM(
      'termos_uso',           // Termos de uso
      'politica_privacidade', // Política de privacidade
      'processamento_dados',  // Processamento de dados pessoais
      'processamento_ia',     // Processamento por IA
      'marketing_email',      // Emails de marketing
      'cookies_essenciais',   // Cookies essenciais
      'cookies_analiticos',   // Cookies analíticos
      'cookies_marketing'     // Cookies de marketing
    ),
    allowNull: false
  },
  
  // Status do consentimento (concedido ou revogado)
  status: {
    type: DataTypes.ENUM('concedido', 'revogado'),
    allowNull: false
  },
  
  // Versão do documento de consentimento aceito
  document_version: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  
  // Texto completo do documento de consentimento
  document_text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  
  // Data de concessão do consentimento
  granted_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  // Data de revogação do consentimento
  revoked_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  // Endereço IP usado quando o consentimento foi concedido
  ip_address: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  
  // User agent do navegador usado quando o consentimento foi concedido
  user_agent: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  // Detalhes adicionais sobre o consentimento
  details: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  
  // Notas ou observações sobre o consentimento
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'consent',
  tableName: 'consents',
  underscored: true,
  timestamps: true,
  
  // Índices para melhorar a performance das consultas
  indexes: [
    {
      name: 'consents_user_id_idx',
      fields: ['user_id']
    },
    {
      name: 'consents_type_status_idx',
      fields: ['consent_type', 'status']
    },
    {
      name: 'consents_granted_at_idx',
      fields: ['granted_at']
    }
  ]
});

// Definir relacionamento com o modelo User
Consent.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Consent, { foreignKey: 'user_id', as: 'consents' });

/**
 * Método estático para registrar um novo consentimento
 * 
 * @param {Object} consentData - Dados do consentimento
 * @returns {Promise<Consent>} - Objeto de consentimento criado
 */
Consent.registerConsent = async function(consentData) {
  // Verificar se já existe um consentimento ativo do mesmo tipo
  const existingConsent = await this.findOne({
    where: {
      user_id: consentData.user_id,
      consent_type: consentData.consent_type,
      status: 'concedido'
    }
  });
  
  // Se existir, revogar o consentimento anterior
  if (existingConsent) {
    existingConsent.status = 'revogado';
    existingConsent.revoked_at = new Date();
    await existingConsent.save();
  }
  
  // Criar novo registro de consentimento
  return await this.create({
    ...consentData,
    status: 'concedido',
    granted_at: new Date()
  });
};

/**
 * Método estático para revogar um consentimento
 * 
 * @param {string} userId - ID do usuário
 * @param {string} consentType - Tipo de consentimento
 * @returns {Promise<boolean>} - Verdadeiro se o consentimento foi revogado
 */
Consent.revokeConsent = async function(userId, consentType) {
  // Buscar consentimento ativo
  const consent = await this.findOne({
    where: {
      user_id: userId,
      consent_type: consentType,
      status: 'concedido'
    }
  });
  
  // Se não existir, retornar falso
  if (!consent) {
    return false;
  }
  
  // Revogar consentimento
  consent.status = 'revogado';
  consent.revoked_at = new Date();
  await consent.save();
  
  return true;
};

/**
 * Método estático para verificar se um consentimento está ativo
 * 
 * @param {string} userId - ID do usuário
 * @param {string} consentType - Tipo de consentimento
 * @returns {Promise<boolean>} - Verdadeiro se o consentimento está ativo
 */
Consent.hasActiveConsent = async function(userId, consentType) {
  const count = await this.count({
    where: {
      user_id: userId,
      consent_type: consentType,
      status: 'concedido'
    }
  });
  
  return count > 0;
};

/**
 * Método estático para obter o histórico de consentimentos de um usuário
 * 
 * @param {string} userId - ID do usuário
 * @param {string} consentType - Tipo de consentimento (opcional)
 * @returns {Promise<Array>} - Array de registros de consentimento
 */
Consent.getConsentHistory = async function(userId, consentType = null) {
  const whereClause = {
    user_id: userId
  };
  
  if (consentType) {
    whereClause.consent_type = consentType;
  }
  
  return await this.findAll({
    where: whereClause,
    order: [['created_at', 'DESC']]
  });
};

module.exports = Consent;
