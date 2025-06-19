/**
 * Modelo de Registro Médico
 * 
 * Este modelo define a estrutura da tabela de registros médicos extraídos de documentos.
 * 
 * @author Doc.AI Team
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MedicalRecord = sequelize.define('MedicalRecord', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  documentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Documents',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  recordType: {
    type: DataTypes.ENUM('consulta', 'exame', 'laudo', 'atestado', 'receituario', 'encaminhamento', 'prescricao'),
    allowNull: true,
    defaultValue: 'consulta'
  },
  recordDate: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  },
  doctorName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  doctorCRM: {
    type: DataTypes.STRING,
    allowNull: true
  },
  doctorSpecialty: {
    type: DataTypes.STRING,
    allowNull: true
  },
  specialty: {
    type: DataTypes.STRING,
    allowNull: true
  },
  institution: {
    type: DataTypes.STRING,
    allowNull: true
  },
  diagnosis: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  patientName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  symptoms: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  treatment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  prescriptions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  exams: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  medications: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  vitalSigns: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
    // Exemplo: { "pressao": "120/80", "temperatura": "36.5", "frequenciaCardiaca": "72" }
  },
  labResults: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
    // Exemplo: { "hemoglobina": "14.5", "glicose": "95", "colesterolTotal": "180" }
  },
  recommendations: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  rawText: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  insights: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  aiAnalysis: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  aiTrends: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'MedicalRecords',
  underscored: true,
  indexes: [
    {
      name: 'idx_medical_records_user_id',
      fields: ['user_id']
    },
    {
      name: 'idx_medical_records_document_id',
      fields: ['document_id']
    },
    {
      name: 'idx_medical_records_record_type',
      fields: ['record_type']
    },
    {
      name: 'idx_medical_records_record_date',
      fields: ['record_date']
    }
  ]
});

module.exports = MedicalRecord;
