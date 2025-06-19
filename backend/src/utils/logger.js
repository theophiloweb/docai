/**
 * Configuração de logger
 * 
 * Este arquivo configura o logger para o sistema.
 * 
 * @author Doc.AI Team
 */

const winston = require('winston');
const path = require('path');

// Configuração de níveis de log
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

// Configuração de cores para os níveis de log
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white'
};

// Adicionar cores ao winston
winston.addColors(colors);

// Determinar o nível de log com base no ambiente
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  // Em produção, não mostrar logs de debug
  return env === 'development' ? 'debug' : 'info';
};

// Formato para logs de console
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Formato para logs de arquivo
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.json()
);

// Configuração de transports
const transports = [
  // Console transport
  new winston.transports.Console({
    format: consoleFormat,
    // Filtrar logs de debug relacionados ao Sequelize em produção
    level: (info) => {
      if (process.env.NODE_ENV !== 'development' && 
          info.level === 'debug' && 
          info.message.includes('Executing (default):')) {
        return false;
      }
      return info.level;
    }
  }),
  
  // Arquivo de log para erros
  new winston.transports.File({
    filename: path.join(__dirname, '../../logs/error.log'),
    level: 'error',
    format: fileFormat
  }),
  
  // Arquivo de log para todos os níveis
  new winston.transports.File({
    filename: path.join(__dirname, '../../logs/combined.log'),
    format: fileFormat
  })
];

// Criar logger
const logger = winston.createLogger({
  level: level(),
  levels,
  transports,
  // Filtrar logs de debug do Sequelize
  format: winston.format.combine(
    winston.format((info) => {
      // Em produção, não logar consultas SQL
      if (process.env.NODE_ENV !== 'development' && 
          info.message && 
          info.message.startsWith('Executing (default):')) {
        return false;
      }
      return info;
    })()
  )
});

module.exports = logger;
