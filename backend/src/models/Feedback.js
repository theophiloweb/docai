/**
 * Modelo de Feedback
 * 
 * Este modelo define a estrutura da tabela de feedbacks no banco de dados.
 * 
 * @author Doc.AI Team
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Feedback = sequelize.define('Feedback', {
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
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  position: {
    type: DataTypes.STRING,
    allowNull: true
  },
  company: {
    type: DataTypes.STRING,
    allowNull: true
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isDisplayed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'Feedbacks'
});

module.exports = Feedback;
