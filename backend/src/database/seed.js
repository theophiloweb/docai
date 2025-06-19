/**
 * Script para executar os seeders
 * 
 * Este arquivo é o ponto de entrada para popular o banco de dados com dados fictícios.
 * 
 * @author Doc.AI Team
 */

const runSeeders = require('./seeders');
const logger = require('../utils/logger');

// Executar seeders
(async () => {
  try {
    await runSeeders();
    process.exit(0);
  } catch (error) {
    logger.error('Erro ao executar seeders:', error);
    process.exit(1);
  }
})();
