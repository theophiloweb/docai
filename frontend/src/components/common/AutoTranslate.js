import React, { useState, useEffect } from 'react';
import { useI18n } from '../../context/I18nContext';

/**
 * Componente para tradução automática de conteúdo dinâmico
 * Útil para traduzir dados vindos do banco de dados
 */
const AutoTranslate = ({ 
  text, 
  fallback = '', 
  className = '',
  enabled = true 
}) => {
  const { currentLanguage } = useI18n();
  const [translatedText, setTranslatedText] = useState(text || fallback);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (!enabled || !text || currentLanguage === 'pt-BR') {
      setTranslatedText(text || fallback);
      return;
    }

    translateText(text);
  }, [text, currentLanguage, enabled, fallback]);

  const translateText = async (textToTranslate) => {
    if (!textToTranslate || textToTranslate.length < 3) {
      setTranslatedText(textToTranslate || fallback);
      return;
    }

    setIsTranslating(true);
    
    try {
      // Usar Google Translate API ou serviço similar
      // Por enquanto, implementação básica com mapeamento
      const translated = await basicTranslate(textToTranslate, currentLanguage);
      setTranslatedText(translated);
    } catch (error) {
      console.warn('Erro na tradução automática:', error);
      setTranslatedText(textToTranslate);
    } finally {
      setIsTranslating(false);
    }
  };

  // Tradução básica para termos comuns
  const basicTranslate = async (text, targetLang) => {
    if (targetLang !== 'en-US') return text;

    const translations = {
      // Categorias de documentos
      'médico': 'medical',
      'financeiro': 'financial',
      'orçamento': 'budget',
      'pessoal': 'personal',
      'outros': 'others',
      
      // Status
      'processando': 'processing',
      'analisado': 'analyzed',
      'erro': 'error',
      'pendente': 'pending',
      'aprovado': 'approved',
      'rejeitado': 'rejected',
      
      // Termos médicos comuns
      'consulta': 'consultation',
      'exame': 'exam',
      'receita': 'prescription',
      'laudo': 'report',
      'diagnóstico': 'diagnosis',
      
      // Termos financeiros
      'receita': 'income',
      'despesa': 'expense',
      'fatura': 'invoice',
      'pagamento': 'payment',
      
      // Outros termos comuns
      'documento': 'document',
      'arquivo': 'file',
      'data': 'date',
      'valor': 'amount',
      'total': 'total'
    };

    let translatedText = text.toLowerCase();
    
    // Aplicar traduções básicas
    Object.entries(translations).forEach(([pt, en]) => {
      const regex = new RegExp(`\\b${pt}\\b`, 'gi');
      translatedText = translatedText.replace(regex, en);
    });

    // Capitalizar primeira letra
    return translatedText.charAt(0).toUpperCase() + translatedText.slice(1);
  };

  if (isTranslating) {
    return (
      <span className={`${className} opacity-75`}>
        {text || fallback}
        <span className="ml-1 text-xs text-gray-400">...</span>
      </span>
    );
  }

  return (
    <span className={className}>
      {translatedText}
    </span>
  );
};

export default AutoTranslate;