/**
 * Configuração do banco de dados
 * 
 * Este arquivo configura a conexão com o banco de dados PostgreSQL.
 * 
 * @author Doc.AI Team
 */

const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');
require('dotenv').config();

// Configurações do banco de dados
const config = {
  database: process.env.DB_NAME || 'docai',
  username: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || '1234',  // Usando DB_PASSWORD conforme definido no .env
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' 
    ? (msg) => {
        // Filtrar mensagens SQL para não exibir dados sensíveis
        if (msg.includes('SELECT') || msg.includes('INSERT') || msg.includes('UPDATE')) {
          // Exibir apenas o tipo de operação, não os dados
          const operation = msg.split(' ')[0];
          const table = msg.includes('FROM "') 
            ? msg.split('FROM "')[1].split('"')[0]
            : msg.includes('INTO "') 
              ? msg.split('INTO "')[1].split('"')[0] 
              : 'unknown';
          logger.debug(`${operation} operation on ${table}`);
        } else {
          logger.debug(msg);
        }
      }
    : false, // Em produção, desativar logs SQL
  dialectOptions: {
    ssl: process.env.DB_SSL === 'true' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

// Criar instância do Sequelize
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging,
    dialectOptions: config.dialectOptions,
    pool: config.pool
  }
);

module.exports = {
  sequelize,
  config
};
