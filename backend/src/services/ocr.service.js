/**
 * Serviço de OCR
 * 
 * Este serviço é responsável por extrair texto de documentos usando OCR.
 * 
 * @author Doc.AI Team
 */

const fs = require('fs');
const path = require('path');
const { createWorker } = require('tesseract.js');
const pdf = require('pdf-parse');
const { PDFExtract } = require('pdf.js-extract');
const pdfExtract = new PDFExtract();
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const logger = require('../utils/logger');

/**
 * Extrai texto de um arquivo usando OCR
 * @param {string} filePath - Caminho do arquivo
 * @param {string} fileType - Tipo MIME do arquivo
 * @returns {Promise<string>} - Texto extraído
 */
const extractText = async (filePath, fileType) => {
  try {
    logger.info(`Extraindo texto de ${filePath} (${fileType})`);
    
    // Se for um PDF, usar pdf-parse
    if (fileType === 'application/pdf') {
      return await extractTextFromPdf(filePath);
    }
    
    // Se for um arquivo de texto, ler diretamente
    if (fileType === 'text/plain') {
      try {
        return await fs.promises.readFile(filePath, 'utf8');
      } catch (error) {
        logger.error('Erro ao ler arquivo de texto:', error);
        return `[Erro ao ler arquivo de texto: ${error.message}]`;
      }
    }
    
    // Se for uma imagem, usar Tesseract
    if (fileType.startsWith('image/')) {
      return await extractTextFromImage(filePath);
    }
    
    return `[Tipo de arquivo não suportado: ${fileType}]`;
  } catch (error) {
    logger.error('Erro ao extrair texto:', error);
    return `[Erro ao extrair texto: ${error.message}]`;
  }
};

/**
 * Extrai texto de um arquivo PDF
 * @param {string} filePath - Caminho do arquivo PDF
 * @returns {Promise<string>} - Texto extraído
 */
const extractTextFromPdf = async (filePath) => {
  try {
    // Primeiro, tentar com pdf-parse
    try {
      const dataBuffer = await fs.promises.readFile(filePath);
      const data = await pdf(dataBuffer);
      
      // Verificar se o texto foi extraído com sucesso
      if (data.text && data.text.trim() !== '') {
        logger.info('Texto extraído com sucesso usando pdf-parse');
        return data.text;
      }
    } catch (pdfParseError) {
      logger.warn('Falha ao extrair texto com pdf-parse:', pdfParseError);
    }
    
    // Se pdf-parse falhar, tentar com pdf.js-extract
    try {
      const extractOptions = {};
      const data = await pdfExtract.extract(filePath, extractOptions);
      
      if (data && data.pages) {
        // Concatenar o texto de todas as páginas
        const text = data.pages
          .map(page => page.content.map(item => item.str).join(' '))
          .join('\n\n');
        
        if (text && text.trim() !== '') {
          logger.info('Texto extraído com sucesso usando pdf.js-extract');
          return text;
        }
      }
    } catch (pdfJsError) {
      logger.warn('Falha ao extrair texto com pdf.js-extract:', pdfJsError);
    }
    
    // Se ambos falharem, tentar com pdftotext (Poppler)
    try {
      const outputPath = `${filePath}.txt`;
      await execPromise(`pdftotext -layout "${filePath}" "${outputPath}"`);
      
      const text = await fs.promises.readFile(outputPath, 'utf8');
      await fs.promises.unlink(outputPath); // Remover arquivo temporário
      
      if (text && text.trim() !== '') {
        logger.info('Texto extraído com sucesso usando pdftotext');
        return text;
      }
    } catch (popplerError) {
      logger.warn('Falha ao extrair texto com pdftotext:', popplerError);
    }
    
    // Se todas as tentativas falharem, tentar extrair como imagem
    try {
      logger.info('Tentando extrair PDF como imagem usando Tesseract');
      // Converter primeira página do PDF para imagem e usar OCR
      const tempImagePath = `${filePath}.png`;
      await execPromise(`pdftoppm -png -singlefile "${filePath}" "${filePath.replace('.pdf', '')}"`);
      
      if (fs.existsSync(tempImagePath)) {
        const text = await extractTextFromImage(tempImagePath);
        await fs.promises.unlink(tempImagePath); // Remover arquivo temporário
        
        if (text && text.trim() !== '') {
          logger.info('Texto extraído com sucesso usando PDF como imagem');
          return text;
        }
      }
    } catch (ocrError) {
      logger.error('Erro ao extrair PDF como imagem:', ocrError);
    }
    
    // Se todas as tentativas falharem
    return '[PDF sem texto extraível ou protegido]';
  } catch (error) {
    logger.error('Erro ao extrair texto do PDF:', error);
    return `[Erro ao extrair texto do PDF: ${error.message}]`;
  }
};

/**
 * Extrai texto de uma imagem usando Tesseract
 * @param {string} filePath - Caminho da imagem
 * @returns {Promise<string>} - Texto extraído
 */
const extractTextFromImage = async (filePath) => {
  try {
    const worker = await createWorker('por');
    
    try {
      const { data } = await worker.recognize(filePath);
      return data.text;
    } finally {
      await worker.terminate();
    }
  } catch (error) {
    logger.error('Erro ao extrair texto da imagem:', error);
    return `[Erro ao extrair texto da imagem: ${error.message}]`;
  }
};

module.exports = {
  extractText
};
