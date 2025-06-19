/**
 * Servidor principal
 * 
 * Este arquivo configura e inicia o servidor Express.
 * 
 * @author Doc.AI Team
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const { sequelize } = require('./config/database');
const routes = require('./routes');
const { setupAssociations } = require('./models');
const logger = require('./utils/logger');
const path = require('path');
require('dotenv').config();

// Criar aplicação Express
const app = express();

// Configurar middleware
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: false // Desativado para desenvolvimento
}));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Configurar rotas
app.use('/api', routes);

// Rota de fallback para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  logger.error('Erro não tratado:', err);
  
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Configurar associações de modelos
setupAssociations();

// Porta do servidor
const PORT = process.env.PORT || 3001;

// Iniciar servidor
const startServer = async () => {
  try {
    // Verificar conexão com o banco de dados
    await sequelize.authenticate();
    logger.info('Conexão com o banco de dados estabelecida com sucesso');
    
    // Iniciar servidor
    app.listen(PORT, () => {
      logger.info(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    logger.error('Erro ao iniciar servidor:', error);
    logger.info('Iniciando servidor sem conexão com o banco de dados...');
    
    // Iniciar servidor mesmo sem conexão com o banco de dados
    app.listen(PORT, () => {
      logger.info(`Servidor rodando na porta ${PORT} (sem banco de dados)`);
    });
  }
};

// Importar script para adicionar colunas
const { addBudgetColumns } = require('./scripts/add_budget_columns');

// Iniciar servidor com migração de colunas
const startServerWithMigration = async () => {
  try {
    // Adicionar novas colunas à tabela BudgetRecords
    await addBudgetColumns();
    // Iniciar servidor
    startServer();
  } catch (error) {
    logger.error('Erro ao executar migração:', error);
    // Iniciar servidor mesmo com erro na migração
    startServer();
  }
};

// Iniciar servidor com migração
startServerWithMigration();
