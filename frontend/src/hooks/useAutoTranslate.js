import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '../context/I18nContext';

/**
 * Hook para tradução automática de conteúdo dinâmico
 * Inclui cache para evitar traduções desnecessárias
 */
export const useAutoTranslate = () => {
  const { currentLanguage } = useI18n();
  const [cache, setCache] = useState(new Map());

  // Função para traduzir texto
  const translateText = useCallback(async (text, options = {}) => {
    const {
      enabled = true,
      fallback = text,
      targetLang = currentLanguage
    } = options;

    // Se não habilitado ou idioma é português, retorna original
    if (!enabled || !text || targetLang === 'pt-BR') {
      return text || fallback;
    }

    // Verificar cache
    const cacheKey = `${text}_${targetLang}`;
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    try {
      const translated = await performTranslation(text, targetLang);
      
      // Salvar no cache
      setCache(prev => new Map(prev).set(cacheKey, translated));
      
      return translated;
    } catch (error) {
      console.warn('Erro na tradução:', error);
      return text || fallback;
    }
  }, [currentLanguage, cache]);

  // Função para traduzir múltiplos textos
  const translateBatch = useCallback(async (texts, options = {}) => {
    const promises = texts.map(text => translateText(text, options));
    return Promise.all(promises);
  }, [translateText]);

  // Tradução básica para termos comuns
  const performTranslation = async (text, targetLang) => {
    if (targetLang !== 'en-US') return text;

    // Dicionário de traduções básicas
    const basicTranslations = {
      // Categorias
      'médico': 'medical',
      'financeiro': 'financial', 
      'orçamento': 'budget',
      'pessoal': 'personal',
      'jurídico': 'legal',
      'educacional': 'educational',
      'trabalho': 'work',
      'outros': 'others',
      
      // Status
      'processando': 'processing',
      'analisado': 'analyzed',
      'erro': 'error',
      'pendente': 'pending',
      'aprovado': 'approved',
      'rejeitado': 'rejected',
      'ativo': 'active',
      'inativo': 'inactive',
      
      // Documentos médicos
      'consulta médica': 'medical consultation',
      'exame de sangue': 'blood test',
      'receita médica': 'medical prescription',
      'laudo médico': 'medical report',
      'atestado médico': 'medical certificate',
      'diagnóstico': 'diagnosis',
      'tratamento': 'treatment',
      'medicamento': 'medication',
      
      // Documentos financeiros
      'nota fiscal': 'invoice',
      'recibo': 'receipt',
      'extrato bancário': 'bank statement',
      'comprovante': 'proof',
      'fatura': 'bill',
      'pagamento': 'payment',
      'receita': 'income',
      'despesa': 'expense',
      
      // Orçamentos
      'orçamento': 'budget',
      'cotação': 'quote',
      'proposta': 'proposal',
      'fornecedor': 'supplier',
      'produto': 'product',
      'serviço': 'service',
      
      // Termos gerais
      'documento': 'document',
      'arquivo': 'file',
      'data': 'date',
      'valor': 'amount',
      'total': 'total',
      'quantidade': 'quantity',
      'descrição': 'description',
      'observações': 'notes',
      'detalhes': 'details'
    };

    let translatedText = text.toLowerCase();
    
    // Aplicar traduções básicas (frases completas primeiro)
    Object.entries(basicTranslations)
      .sort(([a], [b]) => b.length - a.length) // Ordenar por tamanho (maiores primeiro)
      .forEach(([pt, en]) => {
        const regex = new RegExp(`\\b${pt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
        translatedText = translatedText.replace(regex, en);
      });

    // Capitalizar primeira letra de cada sentença
    return translatedText.replace(/(^|\. )([a-z])/g, (match, prefix, letter) => 
      prefix + letter.toUpperCase()
    );
  };

  // Limpar cache quando idioma muda
  useEffect(() => {
    setCache(new Map());
  }, [currentLanguage]);

  return {
    translateText,
    translateBatch,
    currentLanguage,
    clearCache: () => setCache(new Map())
  };
};

export default useAutoTranslate;