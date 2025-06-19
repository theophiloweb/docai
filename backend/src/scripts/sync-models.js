/**
 * Script para sincronizar modelos com o banco de dados
 * 
 * Este script sincroniza os modelos com o banco de dados, criando ou alterando tabelas conforme necessário.
 * 
 * @author Doc.AI Team
 */

const { sequelize } = require('../config/database');
const { 
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
  AIPrompt, 
  Log, 
  SystemSettings,
  setupAssociations
} = require('../models');
const logger = require('../utils/logger');

// Configurar associações entre modelos
setupAssociations();

// Sincronizar modelos com o banco de dados
const syncModels = async () => {
  try {
    logger.info('Iniciando sincronização de modelos com o banco de dados...');
    
    // Sincronizar modelos específicos
    await Document.sync({ alter: true });
    await MedicalRecord.sync({ alter: true });
    await FinancialRecord.sync({ alter: true });
    await BudgetRecord.sync({ alter: true });
    await AIPrompt.sync({ alter: true });
    
    logger.info('Sincronização concluída com sucesso!');
    process.exit(0);
  } catch (error) {
    logger.error('Erro ao sincronizar modelos:', error);
    process.exit(1);
  }
};

// Executar sincronização
syncModels();
