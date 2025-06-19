/**
 * Modelo de Documento
 * 
 * Este modelo define a estrutura da tabela de documentos no banco de dados.
 * 
 * @author Doc.AI Team
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Document = sequelize.define('Document', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fileType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fileSize: {
    type: DataTypes.INTEGER, // em bytes
    allowNull: true
  },
  contentText: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  aiProcessed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  aiSummary: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  aiEntities: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  aiCategories: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  aiSentiment: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isArchived: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lastViewed: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'Documents',
  underscored: true
});

module.exports = Document;
