/**
 * Índice de Seeders
 * 
 * Este arquivo importa e executa todos os seeders na ordem correta.
 * 
 * @author Doc.AI Team
 */

const models = require('../../models');
const logger = require('../../utils/logger');

// Importar seeders
const createUsers = require('./userSeeder');
const createPlans = require('./planSeeder');
const createAdminsAndClients = require('./adminClientSeeder');
const createSubscriptions = require('./subscriptionSeeder');
const createDocuments = require('./documentSeeder');
const createMedicalRecords = require('./medicalRecordSeeder');
const createFinancialRecords = require('./financialRecordSeeder');
const createBudgetRecords = require('./budgetRecordSeeder');
const createFeedbacks = require('./feedbackSeeder');
const createContacts = require('./contactSeeder');
const createAISettings = require('./aiSettingsSeeder');
const createAIPrompts = require('./aiPromptSeeder');
const createLogs = require('./logSeeder');

/**
 * Função para executar todos os seeders na ordem correta
 */
const runSeeders = async () => {
  try {
    logger.info('Iniciando seeders...');

    // Configurar associações
    models.setupAssociations();

    // Sincronizar modelos com o banco de dados um por um em ordem específica
    logger.info('Sincronizando tabelas em ordem específica...');
    
    // Primeiro, sincronizar tabelas base sem dependências
    await models.User.sync({ force: true });
    logger.info('Tabela Users sincronizada.');
    
    await models.Plan.sync({ force: true });
    logger.info('Tabela Plans sincronizada.');
    
    await models.AISettings.sync({ force: true });
    logger.info('Tabela AISettings sincronizada.');
    
    await models.AIPrompt.sync({ force: true });
    logger.info('Tabela AIPrompts sincronizada.');
    
    // Depois, sincronizar tabelas com dependências
    await models.Admin.sync({ force: true });
    logger.info('Tabela Admins sincronizada.');
    
    await models.Client.sync({ force: true });
    logger.info('Tabela Clients sincronizada.');
    
    await models.Subscription.sync({ force: true });
    logger.info('Tabela Subscriptions sincronizada.');
    
    await models.Document.sync({ force: true });
    logger.info('Tabela Documents sincronizada.');
    
    await models.MedicalRecord.sync({ force: true });
    logger.info('Tabela MedicalRecords sincronizada.');
    
    await models.FinancialRecord.sync({ force: true });
    logger.info('Tabela FinancialRecords sincronizada.');
    
    await models.BudgetRecord.sync({ force: true });
    logger.info('Tabela BudgetRecords sincronizada.');
    
    await models.Feedback.sync({ force: true });
    logger.info('Tabela Feedbacks sincronizada.');
    
    await models.Contact.sync({ force: true });
    logger.info('Tabela Contacts sincronizada.');
    
    await models.Log.sync({ force: true });
    logger.info('Tabela Logs sincronizada.');

    // Executar seeders na ordem correta
    await createUsers();
    await createPlans();
    await createAdminsAndClients();
    await createSubscriptions();
    await createDocuments();
    await createMedicalRecords();
    await createFinancialRecords();
    await createBudgetRecords();
    await createFeedbacks();
    await createContacts();
    await createAISettings();
    await createAIPrompts();
    await createLogs();

    logger.info('Todos os seeders foram executados com sucesso!');
  } catch (error) {
    logger.error('Erro ao executar seeders:', error);
  }
};

module.exports = runSeeders;
