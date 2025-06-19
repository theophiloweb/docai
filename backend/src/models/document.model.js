/**
 * Modelo de Documento
 * 
 * Este modelo define a estrutura da tabela de documentos no banco de dados,
 * incluindo validações e relacionamentos.
 * 
 * @author Doc.AI Team
 */

const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');
const { encrypt, decrypt } = require('../utils/encryption');
const User = require('./user.model');

class Document extends Model {}

Document.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'id'
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
    references: {
      model: User,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'title',
    validate: {
      notEmpty: {
        msg: 'O título é obrigatório'
      },
      len: {
        args: [3, 100],
        msg: 'O título deve ter entre 3 e 100 caracteres'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'description'
  },
  category: {
    type: DataTypes.ENUM('saude', 'financeiro', 'educacao', 'trabalho', 'outro'),
    allowNull: false,
    defaultValue: 'outro',
    field: 'category'
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    defaultValue: [],
    field: 'tags'
  },
  filePath: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'file_path'
  },
  fileType: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'file_type'
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'file_size'
  },
  contentText: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'content_text'
  },
  aiProcessed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'ai_processed'
  },
  aiSummary: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'ai_summary'
  },
  aiEntities: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'ai_entities'
  },
  aiCategories: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'ai_categories'
  },
  aiSentiment: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'ai_sentiment'
  },
  documentDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'document_date'
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_public'
  },
  isArchived: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_archived'
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'view_count'
  },
  lastViewed: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'last_viewed'
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'updated_at'
  }
}, {
  sequelize,
  modelName: 'Document',
  tableName: 'Documents',
  underscored: true
});

module.exports = Document;
