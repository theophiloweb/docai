/**
 * Script para inserir dados de exemplo de orçamentos
 * 
 * Este script executa o arquivo SQL para inserir dados de exemplo de orçamentos
 * que demonstram a funcionalidade de agrupamento e comparação.
 * 
 * @author Doc.AI Team
 */

const fs = require('fs');
const path = require('path');
const { sequelize } = require('../config/database');
const logger = require('../utils/logger');

/**
 * Executa o script SQL para inserir dados de exemplo
 */
const seedBudgetExamples = async () => {
  try {
    logger.info('Iniciando inserção de dados de exemplo de orçamentos...');
    
    // Caminho para o arquivo SQL
    const sqlFilePath = path.join(__dirname, '../../../insert_budget_examples.sql');
    
    // Verificar se o arquivo existe
    if (!fs.existsSync(sqlFilePath)) {
      logger.error(`Arquivo SQL não encontrado: ${sqlFilePath}`);
      return;
    }
    
    // Ler o conteúdo do arquivo SQL
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Executar o script SQL
    await sequelize.query(sqlContent);
    
    logger.info('Dados de exemplo de orçamentos inseridos com sucesso!');
  } catch (error) {
    logger.error('Erro ao inserir dados de exemplo de orçamentos:', error);
    throw error;
  }
};

// Executar o script se chamado diretamente
if (require.main === module) {
  seedBudgetExamples()
    .then(() => {
      logger.info('Script concluído com sucesso!');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Erro ao executar script:', error);
      process.exit(1);
    });
} else {
  // Exportar função para uso em outros scripts
  module.exports = { seedBudgetExamples };
}
