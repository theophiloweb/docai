/**
 * Índice de Modelos
 * 
 * Este arquivo importa todos os modelos e configura suas associações.
 * 
 * @author Doc.AI Team
 */

const { sequelize } = require('../config/database');
const User = require('./User');
const Admin = require('./Admin');
const Client = require('./Client');
const Plan = require('./Plan');
const Subscription = require('./Subscription');
const Document = require('./Document');
const MedicalRecord = require('./MedicalRecord');
const MedicalAnalysis = require('./MedicalAnalysis');
const FinancialRecord = require('./FinancialRecord');
const BudgetRecord = require('./BudgetRecord');
const Feedback = require('./Feedback');
const Contact = require('./Contact');
const AISettings = require('./AISettings');
const AIPrompt = require('./AIPrompt');
const Log = require('./Log');
const SystemSettings = require('./SystemSettings');

// Definição das associações entre os modelos
const setupAssociations = () => {
  // Associações de User
  User.hasOne(Admin, { foreignKey: 'userId', as: 'adminProfile' });
  User.hasOne(Client, { foreignKey: 'userId', as: 'clientProfile' });
  User.hasMany(Document, { foreignKey: 'userId', as: 'documents' });
  User.hasOne(Subscription, { foreignKey: 'userId', as: 'subscription' });
  User.hasMany(Feedback, { foreignKey: 'userId', as: 'feedbacks' });
  User.hasMany(Log, { foreignKey: 'userId', as: 'logs' });
  User.hasMany(MedicalRecord, { foreignKey: 'userId', as: 'medicalRecords' });
  User.hasMany(MedicalAnalysis, { foreignKey: 'userId', as: 'medicalAnalyses' });
  User.hasMany(FinancialRecord, { foreignKey: 'userId', as: 'financialRecords' });
  User.hasMany(BudgetRecord, { foreignKey: 'userId', as: 'budgetRecords' });

  // Associações de Admin
  Admin.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  // Associações de Client
  Client.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  Client.belongsTo(Client, { foreignKey: 'referredBy', as: 'referrer' });
  Client.hasMany(Client, { foreignKey: 'referredBy', as: 'referrals' });
  Client.hasOne(Subscription, { foreignKey: 'userId', as: 'subscription', sourceKey: 'userId' });

  // Associações de Plan
  Plan.hasMany(Subscription, { foreignKey: 'planId', as: 'subscriptions' });

  // Associações de Subscription
  Subscription.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  Subscription.belongsTo(Plan, { foreignKey: 'planId', as: 'plan' });

  // Associações de Document
  Document.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  Document.hasMany(MedicalRecord, { foreignKey: 'documentId', as: 'medicalRecords' });
  Document.hasMany(FinancialRecord, { foreignKey: 'documentId', as: 'financialRecords' });
  Document.hasMany(BudgetRecord, { foreignKey: 'documentId', as: 'budgetRecords' });

  // Associações de MedicalRecord
  MedicalRecord.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  MedicalRecord.belongsTo(Document, { foreignKey: 'documentId', as: 'document' });

  // Associações de MedicalAnalysis
  MedicalAnalysis.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  // Associações de FinancialRecord
  FinancialRecord.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  FinancialRecord.belongsTo(Document, { foreignKey: 'documentId', as: 'document' });

  // Associações de BudgetRecord
  BudgetRecord.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  BudgetRecord.belongsTo(Document, { foreignKey: 'documentId', as: 'document' });

  // Associações de Feedback
  Feedback.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  // Associações de Contact
  Contact.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignedUser' });

  // Associações de Log
  Log.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  
  // Criar tabela MedicalAnalyses se não existir
  MedicalAnalysis.sync();
  
  // Criar tabela AIPrompts se não existir
  AIPrompt.sync();
};

module.exports = {
  sequelize,
  User,
  Admin,
  Client,
  Plan,
  Subscription,
  Document,
  MedicalRecord,
  MedicalAnalysis,
  FinancialRecord,
  BudgetRecord,
  Feedback,
  Contact,
  AISettings,
  AIPrompt,
  Log,
  SystemSettings,
  setupAssociations
};
