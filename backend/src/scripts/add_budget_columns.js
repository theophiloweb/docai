/**
 * Script para adicionar colunas à tabela BudgetRecords
 * 
 * Este script adiciona novas colunas à tabela BudgetRecords para suportar
 * a funcionalidade de agrupamento e comparação de orçamentos.
 * 
 * @author Doc.AI Team
 */

const { sequelize } = require('../config/database');
const logger = require('../utils/logger');

/**
 * Adiciona colunas à tabela BudgetRecords
 */
const addBudgetColumns = async () => {
  try {
    logger.info('Iniciando adição de colunas à tabela BudgetRecords...');
    
    // Verificar se a tabela existe
    const tableExists = await sequelize.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'BudgetRecords'
      );
    `, { type: sequelize.QueryTypes.SELECT });
    
    if (!tableExists[0].exists) {
      logger.info('Tabela BudgetRecords não existe. Pulando migração.');
      return;
    }
    
    // Verificar se as colunas já existem
    const columnsInfo = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'BudgetRecords';
    `, { type: sequelize.QueryTypes.SELECT });
    
    const existingColumns = columnsInfo.map(col => col.column_name);
    
    // Adicionar coluna group_id se não existir
    if (!existingColumns.includes('group_id')) {
      logger.info('Adicionando coluna group_id...');
      await sequelize.query(`
        ALTER TABLE "BudgetRecords" 
        ADD COLUMN group_id VARCHAR(255) NULL;
      `);
      
      // Adicionar índice para a coluna
      await sequelize.query(`
        CREATE INDEX idx_budget_records_group_id ON "BudgetRecords" (group_id);
      `);
    }
    
    // Adicionar coluna delivery_time se não existir
    if (!existingColumns.includes('delivery_time')) {
      logger.info('Adicionando coluna delivery_time...');
      await sequelize.query(`
        ALTER TABLE "BudgetRecords" 
        ADD COLUMN delivery_time INTEGER NULL;
      `);
    }
    
    // Adicionar coluna warranty se não existir
    if (!existingColumns.includes('warranty')) {
      logger.info('Adicionando coluna warranty...');
      await sequelize.query(`
        ALTER TABLE "BudgetRecords" 
        ADD COLUMN warranty VARCHAR(255) NULL;
      `);
    }
    
    // Adicionar coluna warranty_months se não existir
    if (!existingColumns.includes('warranty_months')) {
      logger.info('Adicionando coluna warranty_months...');
      await sequelize.query(`
        ALTER TABLE "BudgetRecords" 
        ADD COLUMN warranty_months INTEGER NULL;
      `);
    }
    
    // Adicionar coluna shipping_cost se não existir
    if (!existingColumns.includes('shipping_cost')) {
      logger.info('Adicionando coluna shipping_cost...');
      await sequelize.query(`
        ALTER TABLE "BudgetRecords" 
        ADD COLUMN shipping_cost DECIMAL(10,2) DEFAULT 0;
      `);
    }
    
    // Adicionar coluna reclame_aqui_score se não existir
    if (!existingColumns.includes('reclame_aqui_score')) {
      logger.info('Adicionando coluna reclame_aqui_score...');
      await sequelize.query(`
        ALTER TABLE "BudgetRecords" 
        ADD COLUMN reclame_aqui_score FLOAT NULL;
      `);
    }
    
    // Adicionar coluna product_rating se não existir
    if (!existingColumns.includes('product_rating')) {
      logger.info('Adicionando coluna product_rating...');
      await sequelize.query(`
        ALTER TABLE "BudgetRecords" 
        ADD COLUMN product_rating FLOAT NULL;
      `);
    }
    
    // Adicionar coluna depreciation se não existir
    if (!existingColumns.includes('depreciation')) {
      logger.info('Adicionando coluna depreciation...');
      await sequelize.query(`
        ALTER TABLE "BudgetRecords" 
        ADD COLUMN depreciation FLOAT NULL;
      `);
    }
    
    // Adicionar coluna risk_factors se não existir
    if (!existingColumns.includes('risk_factors')) {
      logger.info('Adicionando coluna risk_factors...');
      await sequelize.query(`
        ALTER TABLE "BudgetRecords" 
        ADD COLUMN risk_factors TEXT[] NULL;
      `);
    }
    
    // Adicionar coluna ai_analysis se não existir
    if (!existingColumns.includes('ai_analysis')) {
      logger.info('Adicionando coluna ai_analysis...');
      await sequelize.query(`
        ALTER TABLE "BudgetRecords" 
        ADD COLUMN ai_analysis TEXT NULL;
      `);
    }
    
    // Adicionar coluna ai_recommendation se não existir
    if (!existingColumns.includes('ai_recommendation')) {
      logger.info('Adicionando coluna ai_recommendation...');
      await sequelize.query(`
        ALTER TABLE "BudgetRecords" 
        ADD COLUMN ai_recommendation TEXT NULL;
      `);
    }
    
    // Adicionar coluna ai_comparison se não existir
    if (!existingColumns.includes('ai_comparison')) {
      logger.info('Adicionando coluna ai_comparison...');
      await sequelize.query(`
        ALTER TABLE "BudgetRecords" 
        ADD COLUMN ai_comparison JSONB NULL;
      `);
    }
    
    logger.info('Adição de colunas à tabela BudgetRecords concluída com sucesso!');
  } catch (error) {
    logger.error('Erro ao adicionar colunas à tabela BudgetRecords:', error);
    throw error;
  }
};

module.exports = { addBudgetColumns };
