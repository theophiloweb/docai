/**
 * Serviço de OCR usando comandos CLI
 * 
 * Este serviço é responsável por extrair texto de documentos usando comandos CLI
 * e analisar o conteúdo usando Llama 4 via OpenRouter.
 * 
 * @author Doc.AI Team
 */

const fs = require('fs').promises;
const path = require('path');
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
    
    // Se for um PDF, usar pdftotext
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
    
    // Se for uma imagem, usar Tesseract CLI
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
    // Primeiro, tentar com pdftotext (mais rápido)
    try {
      logger.info('Tentando extrair texto com pdftotext');
      const { stdout, stderr } = await execPromise(`pdftotext -layout -nopgbrk "${filePath}" -`);
      
      if (stderr) {
        logger.warn(`pdftotext stderr: ${stderr}`);
      }
      
      if (stdout && stdout.trim() !== '') {
        logger.info('Texto extraído com sucesso usando pdftotext');
        
        // Verificar se o texto extraído contém tabelas (linhas com muitos espaços)
        const lines = stdout.split('\n');
        const potentialTableLines = lines.filter(line => 
          line.includes('  ') && 
          (line.match(/\s{2,}/g) || []).length >= 3
        );
        
        // Se houver potenciais tabelas, tentar melhorar a formatação
        if (potentialTableLines.length > 5) {
          logger.info('Tabelas detectadas no PDF, tentando melhorar a formatação');
          
          // Tentar extrair com opção -table para melhor formatação de tabelas
          try {
            const { stdout: tableStdout } = await execPromise(`pdftotext -table -nopgbrk "${filePath}" -`);
            if (tableStdout && tableStdout.trim() !== '') {
              logger.info('Texto com tabelas extraído com sucesso');
              return tableStdout;
            }
          } catch (tableError) {
            logger.warn('Erro ao extrair tabelas com pdftotext -table:', tableError);
          }
        }
        
        return stdout;
      }
    } catch (pdfTextError) {
      logger.warn('Falha ao extrair texto com pdftotext:', pdfTextError);
    }
    
    // Se pdftotext falhar, tentar com pdftoppm + tesseract
    logger.info('Tentando extrair PDF como imagens');
    
    // Obter informações sobre o PDF
    const { stdout: pdfInfoOutput } = await execPromise(`pdfinfo "${filePath}"`);
    const pagesMatch = pdfInfoOutput.match(/Pages:\s+(\d+)/);
    const numPages = pagesMatch ? parseInt(pagesMatch[1]) : 1;
    
    // Limitar o número de páginas processadas para PDFs muito grandes
    const pagesToProcess = Math.min(numPages, 10);
    logger.info(`PDF tem ${numPages} páginas, processando ${pagesToProcess} páginas`);
    
    // Converter páginas do PDF para imagens
    const imageBasePath = `${filePath}-page`;
    await execPromise(`pdftoppm -png -r 300 -f 1 -l ${pagesToProcess} "${filePath}" "${imageBasePath}"`);
    
    // Processar cada página
    let fullText = '';
    for (let i = 1; i <= pagesToProcess; i++) {
      const pageImagePath = `${imageBasePath}-${i}.png`;
      
      try {
        // Verificar se a imagem foi gerada
        await fs.access(pageImagePath);
        
        // Processar a imagem com OCR
        logger.info(`Processando página ${i} com OCR`);
        
        // Usar configuração padrão para extração de texto
        const { stdout: pageText } = await execPromise(
          `tesseract "${pageImagePath}" stdout -l por --oem 1 --psm 3 --dpi 300`
        );
        
        if (pageText && pageText.trim() !== '') {
          fullText += `\n\n--- Página ${i} ---\n\n${pageText}`;
        }
        
        // Remover arquivo temporário
        try {
          await fs.unlink(pageImagePath);
        } catch (unlinkError) {
          logger.warn(`Erro ao remover arquivo temporário da página ${i}:`, unlinkError);
        }
      } catch (accessError) {
        logger.warn(`Imagem da página ${i} não foi gerada:`, accessError);
      }
    }
    
    if (fullText.trim() !== '') {
      logger.info(`Texto extraído com sucesso de ${pagesToProcess} páginas`);
      return fullText;
    }
    
    // Se todas as tentativas falharem
    return '[PDF sem texto extraível ou protegido]';
  } catch (error) {
    logger.error('Erro ao extrair texto do PDF:', error);
    return `[Erro ao extrair texto do PDF: ${error.message}]`;
  }
};

/**
 * Extrai texto de uma imagem usando Tesseract CLI
 * @param {string} filePath - Caminho da imagem
 * @returns {Promise<string>} - Texto extraído
 */
const extractTextFromImage = async (filePath) => {
  try {
    // Primeiro, tentar melhorar a imagem com ImageMagick (se disponível)
    const enhancedImagePath = `${filePath}_enhanced.png`;
    const binarizedImagePath = `${filePath}_binarized.png`;
    const grayscalePath = `${filePath}_grayscale.png`;
    
    try {
      // Converter para escala de cinza primeiro
      await execPromise(`convert "${filePath}" -colorspace gray "${grayscalePath}"`);
      logger.info('Imagem convertida para escala de cinza');
      
      // Melhorar a imagem com ImageMagick - parâmetros otimizados para texto
      await execPromise(`convert "${grayscalePath}" -density 300 -normalize -sharpen 0x1 -contrast-stretch 2x98% -deskew 40% "${enhancedImagePath}"`);
      logger.info('Imagem melhorada com ImageMagick');
      
      // Criar uma versão binarizada para melhor reconhecimento de texto
      await execPromise(`convert "${enhancedImagePath}" -threshold 50% "${binarizedImagePath}"`);
      logger.info('Imagem binarizada criada');
    } catch (enhanceError) {
      logger.warn('Não foi possível melhorar a imagem com ImageMagick:', enhanceError);
    }
    
    // Configurações para tentar - diferentes combinações de parâmetros
    const configurations = [
      // Imagem melhorada com configurações específicas para texto impresso
      { 
        image: enhancedImagePath, 
        command: `tesseract "${enhancedImagePath}" stdout -l por --oem 1 --psm 3 --dpi 300 -c textord_min_linesize=2.5 -c preserve_interword_spaces=1`
      },
      // Imagem binarizada com configurações para texto impresso
      { 
        image: binarizedImagePath, 
        command: `tesseract "${binarizedImagePath}" stdout -l por --oem 1 --psm 3 --dpi 300 -c textord_min_linesize=2.5 -c preserve_interword_spaces=1`
      },
      // Imagem em escala de cinza com configurações para texto impresso
      { 
        image: grayscalePath, 
        command: `tesseract "${grayscalePath}" stdout -l por --oem 1 --psm 3 --dpi 300 -c textord_min_linesize=2.5 -c preserve_interword_spaces=1`
      },
      // Imagem original com configurações para texto impresso
      { 
        image: filePath, 
        command: `tesseract "${filePath}" stdout -l por --oem 1 --psm 3 --dpi 300 -c textord_min_linesize=2.5 -c preserve_interword_spaces=1`
      },
      // Imagem melhorada com configurações para texto misto
      { 
        image: enhancedImagePath, 
        command: `tesseract "${enhancedImagePath}" stdout -l por --oem 1 --psm 4 --dpi 300`
      },
      // Imagem binarizada com configurações para texto misto
      { 
        image: binarizedImagePath, 
        command: `tesseract "${binarizedImagePath}" stdout -l por --oem 1 --psm 4 --dpi 300`
      },
      // Imagem melhorada com configurações para texto em coluna única
      { 
        image: enhancedImagePath, 
        command: `tesseract "${enhancedImagePath}" stdout -l por --oem 1 --psm 6 --dpi 300`
      },
      // Imagem original com configurações para texto em coluna única
      { 
        image: filePath, 
        command: `tesseract "${filePath}" stdout -l por --oem 1 --psm 6 --dpi 300`
      },
      // Imagem original com engine legado (pode ser melhor para alguns tipos de imagens)
      { 
        image: filePath, 
        command: `tesseract "${filePath}" stdout -l por --oem 0 --psm 3 --dpi 300`
      }
    ];
    
    // Função para verificar a qualidade do texto extraído
    const evaluateTextQuality = (text) => {
      if (!text || text.trim().length === 0) return 0;
      
      // Contar caracteres válidos (letras, números, pontuação comum)
      const validChars = text.match(/[a-zA-ZáàâãéèêíìîóòôõúùûçÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÇ0-9.,;:!?()[\]{}\-"']/g) || [];
      
      // Contar caracteres inválidos ou suspeitos
      const invalidChars = text.match(/[^a-zA-ZáàâãéèêíìîóòôõúùûçÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÇ0-9.,;:!?()[\]{}\-"'\s]/g) || [];
      
      // Contar palavras curtas (possíveis erros)
      const shortWords = (text.match(/\b[a-zA-Z]{1,2}\b/g) || []).length;
      
      // Calcular pontuação de qualidade
      const validRatio = validChars.length / (text.length || 1);
      const invalidRatio = invalidChars.length / (text.length || 1);
      const shortWordsRatio = shortWords / ((text.match(/\b[a-zA-Z]+\b/g) || []).length || 1);
      
      // Pontuação final (maior é melhor)
      return (validRatio * 100) - (invalidRatio * 200) - (shortWordsRatio * 50);
    };
    
    // Tentar cada configuração e avaliar os resultados
    let bestResult = '';
    let bestScore = -Infinity;
    
    for (const config of configurations) {
      try {
        // Verificar se a imagem existe
        try {
          await fs.access(config.image);
        } catch (accessError) {
          continue; // Pular esta configuração se a imagem não existir
        }
        
        // Executar Tesseract com a configuração atual
        const { stdout } = await execPromise(config.command);
        
        // Avaliar a qualidade do texto extraído
        const score = evaluateTextQuality(stdout);
        
        // Verificar se esta configuração produziu um resultado melhor
        if (score > bestScore) {
          bestResult = stdout;
          bestScore = score;
          logger.info(`Melhor resultado atualizado: pontuação ${score.toFixed(2)} (comando: ${config.command})`);
        }
      } catch (tesseractError) {
        logger.warn(`Erro ao executar Tesseract com comando: ${config.command}:`, tesseractError);
      }
    }
    
    // Limpar arquivos temporários
    try {
      await fs.access(enhancedImagePath).then(() => fs.unlink(enhancedImagePath)).catch(() => {});
      await fs.access(binarizedImagePath).then(() => fs.unlink(binarizedImagePath)).catch(() => {});
      await fs.access(grayscalePath).then(() => fs.unlink(grayscalePath)).catch(() => {});
    } catch (unlinkError) {
      logger.warn('Erro ao remover arquivos temporários:', unlinkError);
    }
    
    // Verificar se alguma configuração produziu um resultado aceitável
    if (bestScore > 0) {
      logger.info(`Texto extraído com sucesso: pontuação ${bestScore.toFixed(2)}`);
      
      // Pós-processamento para limpar o texto
      let cleanedText = bestResult
        // Remover linhas com apenas caracteres especiais ou muito curtas
        .split('\n')
        .filter(line => {
          const trimmedLine = line.trim();
          if (trimmedLine.length < 2) return false;
          // Verificar se a linha tem pelo menos alguns caracteres válidos
          const validChars = trimmedLine.match(/[a-zA-ZáàâãéèêíìîóòôõúùûçÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÇ0-9]/g) || [];
          return validChars.length > 0;
        })
        .join('\n')
        // Remover caracteres estranhos comuns em OCR
        .replace(/[|\\{}[\]]/g, ' ')
        // Remover múltiplos espaços
        .replace(/\s+/g, ' ')
        // Remover múltiplas quebras de linha
        .replace(/\n\s*\n\s*\n/g, '\n\n');
      
      return cleanedText;
    }
    
    // Se nenhuma configuração funcionou bem, tentar uma abordagem mais simples
    logger.warn('Nenhuma configuração produziu resultados satisfatórios. Tentando abordagem simplificada...');
    
    try {
      // Usar tesseract com configuração básica
      const { stdout: simpleResult } = await execPromise(
        `tesseract "${filePath}" stdout -l por --oem 1 --psm 3`
      );
      
      if (simpleResult && simpleResult.trim() !== '') {
        // Aplicar limpeza básica
        const cleanedResult = simpleResult
          .split('\n')
          .filter(line => line.trim().length > 2)
          .join('\n')
          .replace(/[|\\{}[\]]/g, ' ')
          .replace(/\s+/g, ' ')
          .replace(/\n\s*\n\s*\n/g, '\n\n');
        
        logger.info('Texto extraído com abordagem simplificada');
        return cleanedResult;
      }
    } catch (simpleError) {
      logger.warn('Erro ao tentar abordagem simplificada:', simpleError);
    }
    
    return '[Não foi possível extrair texto legível da imagem]';
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
/**
 * Classifica o documento com base no texto extraído
 * @param {string} text - Texto extraído do documento
 * @returns {Promise<Object>} - Resultado da classificação
 */
const classifyDocument = async (text) => {
  try {
    logger.info(`Classificando documento com base no texto extraído (${text.length} caracteres)`);
    
    // Verificar se o texto é válido
    if (!text || text.length < 10 || text.startsWith('[')) {
      logger.warn('Texto insuficiente para classificação');
      return {
        classification: 'unknown',
        confidence: 0,
        reason: 'Texto insuficiente para classificação'
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
        classification: 'unknown',
        confidence: 0,
        reason: 'Chave de API não configurada'
      };
    }
    
    // Limitar o texto para análise (para ser mais rápido)
    const maxTextLength = 2000;
    const truncatedText = text.length > maxTextLength 
      ? text.substring(0, maxTextLength) + '...' 
      : text;
    
    // Prompt específico para classificação
    const prompt = `
      Você é um especialista em classificação de documentos.
      
      Analise o seguinte texto extraído de um documento e determine a categoria mais apropriada.
      As categorias possíveis são:
      - medical: documentos médicos como receitas, exames, laudos, atestados
      - financial: documentos financeiros como faturas, recibos, extratos bancários
      - budget: orçamentos de produtos ou serviços
      - personal: documentos pessoais como RG, CPF, certidões
      - legal: documentos jurídicos como contratos, procurações
      - education: documentos educacionais como diplomas, históricos escolares
      - work: documentos relacionados a trabalho como holerites, contratos de trabalho
      - other: qualquer outro tipo de documento
      
      Retorne um objeto JSON com os seguintes campos:
      - classification: a categoria do documento (uma das listadas acima)
      - confidence: sua confiança na classificação (0-100)
      - reason: uma breve explicação da sua classificação
      
      Texto do documento:
      ${truncatedText}
    `;
    
    // Chamar a API do OpenRouter com timeout
    try {
      const response = await axios.post(`${apiUrl}/chat/completions`, {
        model: model,
        messages: [
          { role: "system", content: "Você é um especialista em classificação de documentos." },
          { role: "user", content: prompt }
        ],
        temperature: 0.1, // Temperatura muito baixa para respostas mais consistentes
        max_tokens: 300
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://docai.com.br',
          'X-Title': 'Doc.AI'
        },
        timeout: 15000 // 15 segundos de timeout
      });
      
      // Extrair resposta
      const aiResponse = response.data.choices[0].message.content;
      
      // Tentar fazer parse do JSON da resposta
      try {
        const jsonMatch = aiResponse.match(/\{.*\}/s);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        
        return JSON.parse(aiResponse);
      } catch (parseError) {
        logger.error('Erro ao fazer parse da resposta da IA:', parseError);
        return {
          classification: 'unknown',
          confidence: 0,
          reason: 'Erro ao processar resposta da IA'
        };
      }
    } catch (error) {
      logger.error('Erro ao classificar documento:', error);
      return {
        classification: 'unknown',
        confidence: 0,
        reason: `Erro: ${error.message}`
      };
    }
  } catch (error) {
    logger.error('Erro ao classificar documento:', error);
    return {
      classification: 'unknown',
      confidence: 0,
      reason: `Erro: ${error.message}`
    };
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
        error: text.startsWith('[') ? text : 'Texto insuficiente',
        rawText: text
      };
    }
    
    // Classificar o documento independentemente do tipo informado pelo usuário
    const classification = await classifyDocument(text);
    
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
        error: 'Chave de API não configurada',
        rawText: text,
        classification
      };
    }
    
    // Limitar o texto para análise (para ser mais rápido)
    const maxTextLength = 3500; // Aumentado para 3500 caracteres para melhor análise
    const truncatedText = text.length > maxTextLength 
      ? text.substring(0, maxTextLength) + '...' 
      : text;
    
    // Criar prompt com base no tipo de documento
    let prompt;
    switch (documentType) {
      case 'medical':
        prompt = `
          Você é um assistente especializado em análise de documentos médicos.
          
          Analise minuciosamente o seguinte documento médico e extraia as informações estruturadas:
          
          1. Nome do médico
          2. CRM do médico
          3. Especialidade do médico
          4. Data do documento (no formato YYYY-MM-DD)
          5. Nome do paciente
          6. Diagnóstico principal
          7. Prescrições ou recomendações
          8. Exames solicitados ou resultados de exames
          9. Resumo clínico (sumarize o conteúdo principal em até 3 frases)
          10. Pontos de atenção (destaque informações importantes que merecem atenção)
          
          Retorne um objeto JSON com essas informações, sem explicações adicionais.
          Se alguma informação não estiver disponível, use null para o valor.
          
          Documento:
          ${truncatedText}
        `;
        break;
      case 'financial':
        prompt = `
          Você é um assistente especializado em análise de documentos financeiros.
          
          Analise minuciosamente o seguinte documento financeiro e extraia as informações estruturadas:
          
          1. Tipo de documento (nota fiscal, recibo, fatura, etc.)
          2. Data do documento (no formato YYYY-MM-DD)
          3. Emissor/fornecedor
          4. Valor total
          5. Data de vencimento (se aplicável, no formato YYYY-MM-DD)
          6. Categoria (se possível identificar)
          7. Itens ou serviços listados (se houver)
          8. Resumo financeiro (sumarize o conteúdo principal em até 3 frases)
          9. Pontos de atenção (destaque informações importantes como multas, juros, descontos)
          
          Retorne um objeto JSON com essas informações, sem explicações adicionais.
          Se alguma informação não estiver disponível, use null para o valor.
          
          Documento:
          ${truncatedText}
        `;
        break;
      case 'budget':
        prompt = `
          Você é um assistente especializado em análise de orçamentos.
          
          Analise minuciosamente o seguinte orçamento e extraia as informações estruturadas:
          
          1. Título ou descrição do orçamento
          2. Fornecedor
          3. Data do orçamento (no formato YYYY-MM-DD)
          4. Validade (no formato YYYY-MM-DD)
          5. Valor total
          6. Categoria (tecnologia, eletrodoméstico, móveis, veículos, outros)
          7. Itens ou serviços listados (se houver)
          8. Condições de pagamento
          9. Prazo de entrega
          10. Resumo do orçamento (sumarize o conteúdo principal em até 3 frases)
          11. Pontos de atenção (destaque informações importantes como garantias, condições especiais)
          
          Retorne um objeto JSON com essas informações, sem explicações adicionais.
          Se alguma informação não estiver disponível, use null para o valor.
          
          Documento:
          ${truncatedText}
        `;
        break;
      default:
        prompt = `
          Você é um assistente especializado em análise de documentos.
          
          Analise minuciosamente o seguinte documento e extraia as informações estruturadas:
          
          1. Título ou assunto principal
          2. Descrição resumida (máximo 100 caracteres)
          3. Data do documento (no formato YYYY-MM-DD, se disponível)
          4. Tipo de documento (se possível identificar)
          5. Pessoas ou entidades mencionadas
          6. Resumo do conteúdo (sumarize o conteúdo principal em até 3 frases)
          7. Pontos de atenção (destaque informações importantes)
          
          Retorne um objeto JSON com essas informações, sem explicações adicionais.
          Se alguma informação não estiver disponível, use null para o valor.
          
          Documento:
          ${truncatedText}
        `;
    }
    
    // Chamar a API do OpenRouter com timeout
    try {
      const response = await axios.post(`${apiUrl}/chat/completions`, {
        model: model,
        messages: [
          { role: "system", content: "Você é um assistente especializado em análise de documentos." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2, // Temperatura baixa para respostas mais precisas
        max_tokens: 1000 // Aumentado para permitir sumarização mais detalhada
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://docai.com.br',
          'X-Title': 'Doc.AI'
        },
        timeout: 45000 // Aumentado para 45 segundos
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
            rawText: text, // Usar o texto completo, não o truncado
            classification // Incluir a classificação independente
          };
        }
        
        // Se não encontrar um objeto JSON, tentar fazer parse da resposta completa
        const parsedData = JSON.parse(aiResponse);
        return {
          ...parsedData,
          title: parsedData.title || `Documento ${documentType}`,
          description: parsedData.description || `Documento ${documentType} processado`,
          documentDate: parsedData.documentDate || parsedData.date || new Date(),
          rawText: text, // Usar o texto completo, não o truncado
          classification // Incluir a classificação independente
        };
      } catch (parseError) {
        logger.error('Erro ao fazer parse da resposta da IA:', parseError);
        
        // Retornar objeto com texto bruto
        return {
          title: `Documento ${documentType}`,
          description: 'Não foi possível analisar o documento',
          documentDate: new Date(),
          rawText: text,
          aiResponse: aiResponse,
          classification // Incluir a classificação independente
        };
      }
    } catch (apiError) {
      logger.error('Erro ao chamar API de IA:', apiError);
      
      // Retornar objeto com texto bruto, sem erro de API
      return {
        title: `Documento ${documentType}`,
        description: `Documento ${documentType} processado`,
        documentDate: new Date(),
        rawText: text,
        classification // Incluir a classificação independente
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
  analyzeTextWithLlama,
  classifyDocument
};
