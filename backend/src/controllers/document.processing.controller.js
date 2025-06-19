/**
 * Controlador de Processamento de Documentos
 * 
 * Este controlador gerencia o processamento de documentos enviados pelos usuários.
 * 
 * @author Doc.AI Team
 */

const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const cliOcrService = require('../services/cli.ocr.service');
const insightsService = require('../services/insights.service');
const { Document, MedicalRecord, FinancialRecord, BudgetRecord } = require('../models');

/**
 * Processa um documento enviado pelo usuário
 */
exports.processDocument = async (req, res) => {
  try {
    // Verificar se o usuário está autenticado
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado'
      });
    }
    
    // Verificar se o arquivo foi enviado
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum arquivo enviado'
      });
    }
    
    // Verificar se o tipo de documento foi especificado
    const { documentType } = req.body;
    if (!documentType) {
      return res.status(400).json({
        success: false,
        message: 'Tipo de documento não especificado'
      });
    }
    
    // Obter informações do arquivo
    const { path: filePath, mimetype: fileType, originalname: fileName, size: fileSize } = req.file;
    
    logger.info(`Processando documento: ${fileName} (${fileType}, ${fileSize} bytes)`);
    
    // Extrair texto do documento usando OCR baseado em CLI
    let extractedText;
    try {
      extractedText = await cliOcrService.extractText(filePath, fileType);
      logger.info(`Texto extraído com sucesso (${extractedText.length} caracteres)`);
    } catch (ocrError) {
      logger.error('Erro ao extrair texto:', ocrError);
      extractedText = `[Erro ao extrair texto: ${ocrError.message}]`;
    }
    
    // Analisar o texto extraído com Llama 4
    let analysisResult;
    let tempRecordId = uuidv4(); // ID temporário para o registro
    
    try {
      // Usar Llama 4 para análise
      analysisResult = await cliOcrService.analyzeTextWithLlama(extractedText, documentType);
      
      // Verificar se a classificação da IA é diferente da informada pelo usuário
      if (analysisResult.classification && 
          analysisResult.classification.classification !== 'unknown' &&
          analysisResult.classification.confidence > 70 &&
          analysisResult.classification.classification !== documentType) {
        
        // Adicionar flag de classificação inconsistente
        analysisResult.classificationMismatch = {
          userType: documentType,
          aiType: analysisResult.classification.classification,
          confidence: analysisResult.classification.confidence,
          reason: analysisResult.classification.reason
        };
        
        logger.info(`Classificação inconsistente detectada: usuário=${documentType}, IA=${analysisResult.classification.classification}`);
      }
      
      // Gerar insights para o documento
      const insights = await insightsService.generateInsights(extractedText, documentType);
      analysisResult.insights = insights;
      
      logger.info('Insights gerados com sucesso');
    } catch (analysisError) {
      logger.error('Erro ao analisar documento com Llama 4:', analysisError);
      analysisResult = {
        title: fileName,
        description: 'Erro ao analisar documento',
        documentDate: new Date(),
        error: analysisError.message,
        rawText: extractedText
      };
    }
    
    // Excluir o arquivo temporário após processamento
    try {
      await fs.unlink(filePath);
    } catch (unlinkError) {
      logger.error('Erro ao excluir arquivo temporário:', unlinkError);
    }
    
    logger.info(`Documento processado com sucesso: ${tempRecordId}`);
    
    // Armazenar temporariamente os dados extraídos para confirmação posterior
    // Em um ambiente de produção, isso seria armazenado em um banco de dados ou cache
    // Para este exemplo, vamos usar uma variável global (não ideal para produção)
    if (!global.pendingDocuments) {
      global.pendingDocuments = {};
    }
    
    global.pendingDocuments[tempRecordId] = {
      userId: req.user.id,
      documentType,
      extractedText,
      analysisResult,
      createdAt: new Date()
    };
    
    // Configurar um timeout para limpar documentos pendentes não confirmados (30 minutos)
    setTimeout(() => {
      if (global.pendingDocuments && global.pendingDocuments[tempRecordId]) {
        delete global.pendingDocuments[tempRecordId];
        logger.info(`Documento pendente expirado: ${tempRecordId}`);
      }
    }, 30 * 60 * 1000);
    
    // Retornar resultado do processamento
    return res.status(200).json({
      success: true,
      message: 'Documento processado com sucesso',
      data: {
        recordId: tempRecordId,
        documentType,
        extractedText,
        analysisResult,
        // Adicionar flag de classificação inconsistente se existir
        classificationMismatch: analysisResult.classificationMismatch || null
      }
    });
  } catch (error) {
    logger.error('Erro ao processar documento:', error);
    
    // Tentar excluir o arquivo temporário em caso de erro
    if (req.file && req.file.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        logger.error('Erro ao excluir arquivo temporário:', unlinkError);
      }
    }
    
    return res.status(500).json({
      success: false,
      message: 'Erro ao processar documento',
      error: error.message
    });
  }
};

/**
 * Confirma o processamento de um documento e salva no banco de dados
 */
exports.confirmDocument = async (req, res) => {
  try {
    const { recordId, documentType, useAiClassification } = req.body;
    
    // Verificar se o documento pendente existe
    if (!global.pendingDocuments || !global.pendingDocuments[recordId]) {
      return res.status(404).json({
        success: false,
        message: 'Documento não encontrado ou expirado'
      });
    }
    
    const pendingDoc = global.pendingDocuments[recordId];
    
    // Verificar se o usuário é o mesmo que enviou o documento
    if (pendingDoc.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para confirmar este documento'
      });
    }
    
    // Determinar o tipo final do documento
    let finalDocumentType = documentType;
    
    // Se useAiClassification for true e houver uma classificação da IA, usar a classificação da IA
    if (useAiClassification && 
        pendingDoc.analysisResult && 
        pendingDoc.analysisResult.classification && 
        pendingDoc.analysisResult.classification.classification !== 'unknown') {
      finalDocumentType = pendingDoc.analysisResult.classification.classification;
      logger.info(`Usando classificação da IA: ${finalDocumentType} (original: ${documentType})`);
    }
    
    // Salvar o documento no banco de dados com base no tipo final
    let savedRecordId;
    
    switch (finalDocumentType) {
      case 'medical':
        savedRecordId = await saveMedicalRecord(
          req.user.id, 
          pendingDoc.extractedText, 
          pendingDoc.analysisResult
        );
        break;
      case 'financial':
        savedRecordId = await saveFinancialRecord(
          req.user.id, 
          pendingDoc.extractedText, 
          pendingDoc.analysisResult
        );
        break;
      case 'budget':
        savedRecordId = await saveBudgetRecord(
          req.user.id, 
          pendingDoc.extractedText, 
          pendingDoc.analysisResult
        );
        break;
      default:
        savedRecordId = await saveGenericDocument(
          req.user.id, 
          finalDocumentType, 
          pendingDoc.extractedText,
          pendingDoc.analysisResult
        );
    }
    
    // Remover o documento pendente
    delete global.pendingDocuments[recordId];
    
    logger.info(`Documento confirmado e salvo: ${savedRecordId} (tipo: ${finalDocumentType})`);
    
    return res.status(200).json({
      success: true,
      message: 'Documento confirmado e salvo com sucesso',
      data: {
        recordId: savedRecordId,
        documentType: finalDocumentType,
        reclassified: finalDocumentType !== documentType
      }
    });
  } catch (error) {
    logger.error('Erro ao confirmar documento:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao confirmar documento',
      error: error.message
    });
  }
};

/**
 * Rejeita o processamento de um documento
 */
exports.rejectDocument = async (req, res) => {
  try {
    const { recordId } = req.body;
    
    // Verificar se o documento pendente existe
    if (!global.pendingDocuments || !global.pendingDocuments[recordId]) {
      return res.status(404).json({
        success: false,
        message: 'Documento não encontrado ou já expirado'
      });
    }
    
    const pendingDoc = global.pendingDocuments[recordId];
    
    // Verificar se o usuário é o mesmo que enviou o documento
    if (pendingDoc.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para rejeitar este documento'
      });
    }
    
    // Remover o documento pendente
    delete global.pendingDocuments[recordId];
    
    logger.info(`Documento rejeitado: ${recordId}`);
    
    return res.status(200).json({
      success: true,
      message: 'Documento rejeitado com sucesso'
    });
  } catch (error) {
    logger.error('Erro ao rejeitar documento:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao rejeitar documento',
      error: error.message
    });
  }
};

/**
 * Salva um registro médico no banco de dados
 * @param {string} userId - ID do usuário
 * @param {string} extractedText - Texto extraído do documento
 * @param {Object} analysisResult - Resultado da análise do documento
 * @returns {Promise<string>} - ID do registro salvo
 */
const saveMedicalRecord = async (userId, extractedText, analysisResult) => {
  try {
    // Preparar insights
    const insights = analysisResult.insights || {};
    
    // Criar documento
    const document = await Document.create({
      userId,
      title: analysisResult.title || 'Documento Médico',
      description: analysisResult.description || `Consulta com Dr. ${analysisResult.doctorName || 'Não identificado'}`,
      category: 'saude',
      contentText: extractedText,
      aiProcessed: true,
      fileType: analysisResult.fileType || 'pdf',
      fileSize: analysisResult.fileSize || 0,
      aiSummary: insights.summary || '',
      documentDate: analysisResult.documentDate || new Date()
    });
    
    // Criar registro médico
    const medicalRecord = await MedicalRecord.create({
      documentId: document.id,
      userId,
      doctorName: analysisResult.doctorName || null,
      doctorCRM: analysisResult.doctorCRM || null,
      doctorSpecialty: analysisResult.doctorSpecialty || analysisResult.specialty || null,
      recordType: 'consulta',
      recordDate: analysisResult.documentDate || new Date(),
      patientName: analysisResult.patientName || null,
      diagnosis: analysisResult.diagnosis || null,
      prescriptions: analysisResult.prescriptions || null,
      exams: analysisResult.exams || null,
      rawText: extractedText,
      insights: typeof insights === 'string' ? insights : JSON.stringify(insights)
    });
    
    return document.id;
  } catch (error) {
    logger.error('Erro ao salvar registro médico:', error);
    throw error;
  }
};

/**
 * Salva um registro financeiro no banco de dados
 * @param {string} userId - ID do usuário
 * @param {string} extractedText - Texto extraído do documento
 * @param {Object} analysisResult - Resultado da análise do documento
 * @returns {Promise<string>} - ID do registro salvo
 */
const saveFinancialRecord = async (userId, extractedText, analysisResult) => {
  try {
    // Preparar insights
    const insights = analysisResult.insights || {};
    
    // Criar documento
    const document = await Document.create({
      userId,
      title: analysisResult.title || analysisResult.tipoDocumento || 'Documento Financeiro',
      description: analysisResult.description || `${analysisResult.tipoDocumento || 'Documento'} de ${analysisResult.emissor || 'Não identificado'}`,
      category: 'financeiro',
      contentText: extractedText,
      aiProcessed: true,
      fileType: analysisResult.fileType || 'pdf',
      fileSize: analysisResult.fileSize || 0,
      aiSummary: insights.summary || '',
      documentDate: analysisResult.dataDocumento || new Date()
    });
    
    // Criar registro financeiro
    const financialRecord = await FinancialRecord.create({
      documentId: document.id,
      userId,
      documentType: analysisResult.tipoDocumento || null,
      documentDate: analysisResult.dataDocumento || new Date(),
      totalAmount: analysisResult.valorTotal || 0,
      issuer: analysisResult.emissor || null,
      category: analysisResult.categoria || null,
      dueDate: analysisResult.dataVencimento || null,
      status: analysisResult.status || 'pending',
      items: JSON.stringify(analysisResult.itens || []),
      rawText: extractedText,
      aiAnalysis: typeof insights === 'string' ? insights : JSON.stringify(insights)
    });
    
    return document.id;
  } catch (error) {
    logger.error('Erro ao salvar registro financeiro:', error);
    throw error;
  }
};

/**
 * Salva um registro de orçamento no banco de dados
 * @param {string} userId - ID do usuário
 * @param {string} extractedText - Texto extraído do documento
 * @param {Object} analysisResult - Resultado da análise do documento
 * @returns {Promise<string>} - ID do registro salvo
 */
const saveBudgetRecord = async (userId, extractedText, analysisResult) => {
  try {
    // Criar documento
    const document = await Document.create({
      userId,
      title: analysisResult.title || analysisResult.titulo || 'Orçamento',
      description: analysisResult.description || `Orçamento de ${analysisResult.fornecedor || 'Não identificado'}`,
      category: 'budget',
      contentText: extractedText,
      aiProcessed: true
    });
    
    // Preparar insights
    const insights = analysisResult.insights || {};
    
    // Criar registro de orçamento
    const budgetRecord = await BudgetRecord.create({
      documentId: document.id,
      userId,
      title: analysisResult.title || analysisResult.titulo || 'Orçamento',
      provider: analysisResult.provider || analysisResult.fornecedor || null,
      issueDate: analysisResult.issueDate || analysisResult.dataOrcamento || new Date(),
      validUntil: analysisResult.validUntil || analysisResult.validade || null,
      totalAmount: analysisResult.totalAmount || analysisResult.valorTotal || 0,
      category: analysisResult.category || analysisResult.categoria || null,
      items: JSON.stringify(analysisResult.items || analysisResult.itens || []),
      paymentTerms: analysisResult.paymentTerms || analysisResult.condicoesPagamento || null,
      deliveryTime: analysisResult.deliveryTime || analysisResult.prazoEntrega || null,
      status: 'pendente',
      rawText: extractedText,
      aiRecommendation: typeof insights === 'string' ? insights : JSON.stringify(insights)
    });
    
    return budgetRecord.id;
  } catch (error) {
    logger.error('Erro ao salvar registro de orçamento:', error);
    throw error;
  }
};

/**
 * Salva um documento genérico no banco de dados
 * @param {string} userId - ID do usuário
 * @param {string} category - Categoria do documento
 * @param {string} extractedText - Texto extraído do documento
 * @param {Object} analysisResult - Resultado da análise do documento
 * @returns {Promise<string>} - ID do documento salvo
 */
const saveGenericDocument = async (userId, category, extractedText, analysisResult) => {
  try {
    // Preparar insights
    const insights = analysisResult.insights || {};
    
    // Criar documento
    const document = await Document.create({
      userId,
      title: analysisResult.title || `Documento ${category}`,
      description: analysisResult.description || `Documento ${category} processado em ${new Date().toLocaleDateString()}`,
      category,
      contentText: extractedText,
      aiProcessed: true,
      aiSummary: insights.summary || null,
      aiEntities: typeof insights === 'object' ? insights : JSON.parse(typeof insights === 'string' ? insights : '{}')
    });
    
    return document.id;
  } catch (error) {
    logger.error('Erro ao salvar documento genérico:', error);
    throw error;
  }
};
