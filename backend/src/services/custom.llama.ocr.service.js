/**
 * Serviço de OCR personalizado com integração Llama
 * 
 * Este serviço é responsável por extrair texto de documentos usando Tesseract.js
 * e analisar o conteúdo usando Llama 4 via OpenRouter.
 * 
 * @author Doc.AI Team
 */

const fs = require('fs').promises;
const path = require('path');
const { createWorker } = require('tesseract.js');
const pdf = require('pdf-parse');
const { PDFExtract } = require('pdf.js-extract');
const pdfExtract = new PDFExtract();
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const axios = require('axios');
const logger = require('../utils/logger');
require('dotenv').config();

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
        return await fs.readFile(filePath, 'utf8');
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
      const dataBuffer = await fs.readFile(filePath);
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
      
      const text = await fs.readFile(outputPath, 'utf8');
      await fs.unlink(outputPath); // Remover arquivo temporário
      
      if (text && text.trim() !== '') {
        logger.info('Texto extraído com sucesso usando pdftotext');
        return text;
      }
    } catch (popplerError) {
      logger.warn('Falha ao extrair texto com pdftotext:', popplerError);
    }
    
    // Se todas as tentativas falharem, tentar extrair como imagem
    try {
      logger.info('Tentando extrair PDF como imagem usando pdftoppm e Tesseract');
      
      // Converter PDF para imagem usando pdftoppm
      const imageBasePath = filePath.replace('.pdf', '');
      await execPromise(`pdftoppm -png -r 300 "${filePath}" "${imageBasePath}"`);
      
      // Procurar por imagens geradas (pdftoppm gera arquivos com nomes como "file-1.png", "file-2.png", etc.)
      const dirPath = path.dirname(filePath);
      const baseName = path.basename(imageBasePath);
      const files = await fs.readdir(dirPath);
      
      // Filtrar arquivos que correspondem ao padrão
      const imageFiles = files.filter(file => 
        file.startsWith(baseName) && file.endsWith('.png')
      ).map(file => path.join(dirPath, file));
      
      if (imageFiles.length > 0) {
        logger.info(`Encontradas ${imageFiles.length} imagens para processar com OCR`);
        
        // Extrair texto de cada imagem
        let allText = '';
        for (const imageFile of imageFiles) {
          const pageText = await extractTextFromImage(imageFile);
          allText += pageText + '\n\n';
          
          // Remover arquivo temporário
          try {
            await fs.unlink(imageFile);
          } catch (unlinkError) {
            logger.warn(`Erro ao remover arquivo temporário ${imageFile}:`, unlinkError);
          }
        }
        
        if (allText.trim() !== '') {
          logger.info('Texto extraído com sucesso usando PDF convertido para imagem');
          return allText;
        }
      } else {
        logger.warn('Nenhuma imagem gerada a partir do PDF');
      }
    } catch (ocrError) {
      logger.error('Erro ao extrair PDF como imagem:', ocrError);
    }
    
    // Se todas as tentativas falharem, tentar com OCR direto no PDF
    try {
      logger.info('Tentando OCR direto no PDF com Tesseract');
      const result = await execPromise(`tesseract "${filePath}" stdout -l por pdf`);
      
      if (result.stdout && result.stdout.trim() !== '') {
        logger.info('Texto extraído com sucesso usando OCR direto no PDF');
        return result.stdout;
      }
    } catch (directOcrError) {
      logger.warn('Falha ao extrair texto com OCR direto no PDF:', directOcrError);
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
    // Usar execPromise para chamar o comando tesseract diretamente
    // Isso evita problemas com o download de arquivos de treinamento
    const outputPath = `${filePath}.txt`;
    
    try {
      await execPromise(`tesseract "${filePath}" "${filePath}" -l por --psm 3`);
      
      if (await fs.access(`${filePath}.txt`).then(() => true).catch(() => false)) {
        const text = await fs.readFile(`${filePath}.txt`, 'utf8');
        await fs.unlink(`${filePath}.txt`); // Remover arquivo temporário
        
        if (text && text.trim() !== '') {
          logger.info('Texto extraído com sucesso usando tesseract CLI');
          return text;
        }
      }
    } catch (tesseractError) {
      logger.warn('Falha ao extrair texto com tesseract CLI:', tesseractError);
    }
    
    // Se o método acima falhar, tentar com Tesseract.js
    try {
      const worker = await createWorker();
      
      try {
        await worker.loadLanguage('por');
        await worker.initialize('por');
        await worker.setParameters({
          tessedit_pageseg_mode: '3',
        });
        
        const { data } = await worker.recognize(filePath);
        
        if (data.text && data.text.trim() !== '') {
          logger.info('Texto extraído com sucesso usando Tesseract.js');
          return data.text;
        }
      } finally {
        await worker.terminate();
      }
    } catch (tesseractJsError) {
      logger.warn('Falha ao extrair texto com Tesseract.js:', tesseractJsError);
    }
    
    return '[Não foi possível extrair texto da imagem]';
  } catch (error) {
    logger.error('Erro ao extrair texto da imagem:', error);
    return `[Erro ao extrair texto da imagem: ${error.message}]`;
  }
};

/**
 * Analisa o texto extraído usando Llama 4 via OpenRouter
 * @param {string} text - Texto extraído
 * @param {string} documentType - Tipo de documento
 * @returns {Promise<Object>} - Resultado da análise
 */
const analyzeTextWithLlama = async (text, documentType) => {
  try {
    logger.info(`Analisando texto com Llama 4 (${text.length} caracteres)`);
    
    // Verificar se o texto é válido
    if (!text || text.length < 10 || text.startsWith('[')) {
      logger.warn('Texto insuficiente para análise');
      return {
        title: `Documento ${documentType}`,
        description: 'Não foi possível extrair texto suficiente para análise',
        documentDate: new Date(),
        error: text.startsWith('[') ? text : 'Texto insuficiente'
      };
    }
    
    // Obter configurações da API
    const apiKey = process.env.AI_API_KEY;
    const apiUrl = process.env.AI_API_URL || 'https://openrouter.ai/api/v1';
    const model = process.env.AI_MODEL || 'meta-llama/llama-4-maverick:free';
    
    // Verificar se a chave de API está configurada
    if (!apiKey) {
      logger.error('Chave de API não configurada');
      return {
        title: `Documento ${documentType}`,
        description: 'A integração com IA não está configurada corretamente',
        documentDate: new Date(),
        error: 'Chave de API não configurada'
      };
    }
    
    // Criar prompt com base no tipo de documento
    let prompt;
    switch (documentType) {
      case 'medical':
        prompt = `
          Você é um assistente especializado em análise de documentos médicos.
          
          Analise o seguinte documento médico e extraia as informações estruturadas:
          
          1. Nome do médico
          2. CRM do médico
          3. Especialidade do médico
          4. Data do documento (no formato YYYY-MM-DD)
          5. Nome do paciente
          6. Diagnóstico principal
          7. Prescrições ou recomendações
          8. Exames solicitados ou resultados de exames
          
          Retorne apenas um objeto JSON com essas informações, sem explicações adicionais.
          Se alguma informação não estiver disponível, use null para o valor.
          
          Documento:
          ${text}
        `;
        break;
      case 'financial':
        prompt = `
          Você é um assistente especializado em análise de documentos financeiros.
          
          Analise o seguinte documento financeiro e extraia as informações estruturadas:
          
          1. Tipo de documento (nota fiscal, recibo, fatura, etc.)
          2. Data do documento (no formato YYYY-MM-DD)
          3. Emissor/fornecedor
          4. Valor total
          5. Data de vencimento (se aplicável, no formato YYYY-MM-DD)
          6. Categoria (se possível identificar)
          7. Itens ou serviços listados (se houver)
          
          Retorne apenas um objeto JSON com essas informações, sem explicações adicionais.
          Se alguma informação não estiver disponível, use null para o valor.
          
          Documento:
          ${text}
        `;
        break;
      case 'budget':
        prompt = `
          Você é um assistente especializado em análise de orçamentos.
          
          Analise o seguinte orçamento e extraia as informações estruturadas:
          
          1. Título ou descrição do orçamento
          2. Fornecedor
          3. Data do orçamento (no formato YYYY-MM-DD)
          4. Validade (no formato YYYY-MM-DD)
          5. Valor total
          6. Categoria (tecnologia, eletrodoméstico, móveis, veículos, outros)
          7. Itens ou serviços listados (se houver)
          8. Condições de pagamento
          9. Prazo de entrega
          
          Retorne apenas um objeto JSON com essas informações, sem explicações adicionais.
          Se alguma informação não estiver disponível, use null para o valor.
          
          Documento:
          ${text}
        `;
        break;
      default:
        prompt = `
          Você é um assistente especializado em análise de documentos.
          
          Analise o seguinte documento e extraia as informações estruturadas:
          
          1. Título ou assunto principal
          2. Descrição resumida (máximo 100 caracteres)
          3. Data do documento (no formato YYYY-MM-DD, se disponível)
          4. Tipo de documento (se possível identificar)
          5. Pessoas ou entidades mencionadas
          
          Retorne apenas um objeto JSON com essas informações, sem explicações adicionais.
          Se alguma informação não estiver disponível, use null para o valor.
          
          Documento:
          ${text}
        `;
    }
    
    // Chamar a API do OpenRouter
    const response = await axios.post(`${apiUrl}/chat/completions`, {
      model: model,
      messages: [
        { role: "system", content: "Você é um assistente especializado em análise de documentos." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2, // Temperatura baixa para respostas mais precisas
      max_tokens: 1000
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://docai.com.br',
        'X-Title': 'Doc.AI'
      }
    });
    
    // Extrair resposta
    const aiResponse = response.data.choices[0].message.content;
    
    // Tentar fazer parse do JSON da resposta
    try {
      // Encontrar o primeiro objeto JSON na resposta
      const jsonMatch = aiResponse.match(/\{.*\}/s);
      if (jsonMatch) {
        const parsedData = JSON.parse(jsonMatch[0]);
        return {
          ...parsedData,
          title: parsedData.title || `Documento ${documentType}`,
          description: parsedData.description || `Documento ${documentType} processado`,
          documentDate: parsedData.documentDate || parsedData.date || new Date(),
          rawText: text
        };
      }
      
      // Se não encontrar um objeto JSON, tentar fazer parse da resposta completa
      const parsedData = JSON.parse(aiResponse);
      return {
        ...parsedData,
        title: parsedData.title || `Documento ${documentType}`,
        description: parsedData.description || `Documento ${documentType} processado`,
        documentDate: parsedData.documentDate || parsedData.date || new Date(),
        rawText: text
      };
    } catch (parseError) {
      logger.error('Erro ao fazer parse da resposta da IA:', parseError);
      
      // Retornar objeto com texto bruto
      return {
        title: `Documento ${documentType}`,
        description: 'Não foi possível analisar o documento',
        documentDate: new Date(),
        rawText: text,
        aiResponse: aiResponse
      };
    }
  } catch (error) {
    logger.error('Erro ao analisar texto com Llama 4:', error);
    return {
      title: `Documento ${documentType}`,
      description: `Erro ao analisar documento: ${error.message}`,
      documentDate: new Date(),
      rawText: text,
      error: error.message
    };
  }
};

module.exports = {
  extractText,
  analyzeTextWithLlama
};
