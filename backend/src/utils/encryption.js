/**
 * Utilitário de criptografia
 * 
 * Este módulo fornece funções para criptografia e descriptografia de dados
 * sensíveis, implementando medidas de segurança conforme Art. 46 da LGPD.
 * 
 * @author Doc.AI Team
 */

const crypto = require('crypto');
const logger = require('./logger');

// Carregamento das variáveis de ambiente
require('dotenv').config();

// Algoritmo de criptografia
const ALGORITHM = 'aes-256-cbc';

// Chave e vetor de inicialização a partir das variáveis de ambiente
// Em produção, estas devem ser armazenadas de forma segura (ex: AWS KMS, HashiCorp Vault)
const getEncryptionKey = () => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key || key.length !== 32) {
    throw new Error('ENCRYPTION_KEY inválida. Deve ter 32 bytes.');
  }
  return Buffer.from(key);
};

const getEncryptionIV = () => {
  const iv = process.env.ENCRYPTION_IV;
  if (!iv || iv.length !== 16) {
    throw new Error('ENCRYPTION_IV inválido. Deve ter 16 bytes.');
  }
  return Buffer.from(iv);
};

/**
 * Criptografa um texto
 * 
 * @param {string} text - Texto a ser criptografado
 * @returns {string} - Texto criptografado em formato hexadecimal
 */
const encrypt = (text) => {
  try {
    if (!text) return null;
    
    const cipher = crypto.createCipheriv(
      ALGORITHM, 
      getEncryptionKey(), 
      getEncryptionIV()
    );
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return encrypted;
  } catch (error) {
    logger.error('Erro ao criptografar dados:', error);
    throw new Error('Falha na criptografia dos dados');
  }
};

/**
 * Descriptografa um texto
 * 
 * @param {string} encryptedText - Texto criptografado em formato hexadecimal
 * @returns {string} - Texto descriptografado
 */
const decrypt = (encryptedText) => {
  try {
    if (!encryptedText) return null;
    
    const decipher = crypto.createDecipheriv(
      ALGORITHM, 
      getEncryptionKey(), 
      getEncryptionIV()
    );
    
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    logger.error('Erro ao descriptografar dados:', error);
    throw new Error('Falha na descriptografia dos dados');
  }
};

/**
 * Gera um hash seguro para uma senha
 * 
 * @param {string} password - Senha a ser hasheada
 * @returns {string} - Hash da senha
 */
const hashPassword = (password) => {
  try {
    // Usando SHA-256 com salt aleatório
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha256').toString('hex');
    
    return `${salt}:${hash}`;
  } catch (error) {
    logger.error('Erro ao gerar hash de senha:', error);
    throw new Error('Falha ao processar senha');
  }
};

/**
 * Verifica se uma senha corresponde ao hash armazenado
 * 
 * @param {string} password - Senha a ser verificada
 * @param {string} storedHash - Hash armazenado no formato "salt:hash"
 * @returns {boolean} - Verdadeiro se a senha corresponder ao hash
 */
const verifyPassword = (password, storedHash) => {
  try {
    const [salt, hash] = storedHash.split(':');
    const calculatedHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha256').toString('hex');
    
    return calculatedHash === hash;
  } catch (error) {
    logger.error('Erro ao verificar senha:', error);
    throw new Error('Falha ao verificar senha');
  }
};

/**
 * Gera um token aleatório seguro
 * 
 * @param {number} length - Comprimento do token em bytes (padrão: 32)
 * @returns {string} - Token em formato hexadecimal
 */
const generateSecureToken = (length = 32) => {
  try {
    return crypto.randomBytes(length).toString('hex');
  } catch (error) {
    logger.error('Erro ao gerar token seguro:', error);
    throw new Error('Falha ao gerar token');
  }
};

module.exports = {
  encrypt,
  decrypt,
  hashPassword,
  verifyPassword,
  generateSecureToken
};
