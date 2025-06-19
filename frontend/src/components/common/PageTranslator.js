import React, { useEffect, useState } from 'react';
import { useI18n } from '../../context/I18nContext';
import { LanguageIcon, XMarkIcon } from '@heroicons/react/24/outline';

/**
 * Componente para tradução completa da página
 * Similar ao Google Translate, traduz todo o conteúdo visível
 */
const PageTranslator = () => {
  const { currentLanguage } = useI18n();
  const [isVisible, setIsVisible] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [originalContent, setOriginalContent] = useState(null);

  // Mostrar widget apenas quando idioma não é português
  useEffect(() => {
    setIsVisible(currentLanguage !== 'pt-BR');
  }, [currentLanguage]);

  // Função para traduzir toda a página
  const translatePage = async () => {
    if (isTranslating) return;

    setIsTranslating(true);

    try {
      // Salvar conteúdo original se ainda não foi salvo
      if (!originalContent) {
        saveOriginalContent();
      }

      // Encontrar todos os elementos de texto
      const textElements = findTextElements();
      
      // Traduzir cada elemento
      for (const element of textElements) {
        const originalText = element.textContent;
        if (originalText && originalText.trim().length > 0) {
          const translatedText = await translateText(originalText);
          if (translatedText !== originalText) {
            element.textContent = translatedText;
            element.setAttribute('data-translated', 'true');
          }
        }
      }

      // Traduzir atributos importantes (placeholders, titles, etc.)
      translateAttributes();

    } catch (error) {
      console.error('Erro ao traduzir página:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  // Função para restaurar conteúdo original
  const restoreOriginalContent = () => {
    if (!originalContent) return;

    // Restaurar elementos de texto
    const translatedElements = document.querySelectorAll('[data-translated="true"]');
    translatedElements.forEach(element => {
      const originalText = originalContent.texts.get(element);
      if (originalText) {
        element.textContent = originalText;
        element.removeAttribute('data-translated');
      }
    });

    // Restaurar atributos
    originalContent.attributes.forEach((value, element) => {
      Object.entries(value).forEach(([attr, originalValue]) => {
        element.setAttribute(attr, originalValue);
      });
    });
  };

  // Salvar conteúdo original
  const saveOriginalContent = () => {
    const textElements = findTextElements();
    const texts = new Map();
    const attributes = new Map();

    textElements.forEach(element => {
      texts.set(element, element.textContent);
    });

    // Salvar atributos importantes
    const elementsWithAttributes = document.querySelectorAll('[placeholder], [title], [alt]');
    elementsWithAttributes.forEach(element => {
      const attrs = {};
      ['placeholder', 'title', 'alt'].forEach(attr => {
        if (element.hasAttribute(attr)) {
          attrs[attr] = element.getAttribute(attr);
        }
      });
      if (Object.keys(attrs).length > 0) {
        attributes.set(element, attrs);
      }
    });

    setOriginalContent({ texts, attributes });
  };

  // Encontrar elementos de texto para tradução
  const findTextElements = () => {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          // Ignorar scripts, styles e elementos ocultos
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          
          const tagName = parent.tagName.toLowerCase();
          if (['script', 'style', 'noscript'].includes(tagName)) {
            return NodeFilter.FILTER_REJECT;
          }

          // Ignorar texto muito curto ou apenas espaços
          const text = node.textContent.trim();
          if (text.length < 3 || /^\s*$/.test(text)) {
            return NodeFilter.FILTER_REJECT;
          }

          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node.parentElement);
    }

    // Remover duplicatas
    return [...new Set(textNodes)];
  };

  // Traduzir atributos importantes
  const translateAttributes = async () => {
    const elementsWithAttributes = document.querySelectorAll('[placeholder], [title], [alt]');
    
    for (const element of elementsWithAttributes) {
      for (const attr of ['placeholder', 'title', 'alt']) {
        if (element.hasAttribute(attr)) {
          const originalValue = element.getAttribute(attr);
          const translatedValue = await translateText(originalValue);
          if (translatedValue !== originalValue) {
            element.setAttribute(attr, translatedValue);
          }
        }
      }
    }
  };

  // Função básica de tradução
  const translateText = async (text) => {
    if (!text || text.trim().length < 3) return text;

    // Tradução básica usando dicionário
    const translations = {
      // Interface comum
      'Carregando...': 'Loading...',
      'Salvar': 'Save',
      'Cancelar': 'Cancel',
      'Excluir': 'Delete',
      'Editar': 'Edit',
      'Visualizar': 'View',
      'Buscar': 'Search',
      'Filtrar': 'Filter',
      'Ordenar': 'Sort',
      'Adicionar': 'Add',
      'Remover': 'Remove',
      'Confirmar': 'Confirm',
      'Voltar': 'Back',
      'Próximo': 'Next',
      'Anterior': 'Previous',
      'Enviar': 'Submit',
      'Fechar': 'Close',
      'Sim': 'Yes',
      'Não': 'No',
      'Todos': 'All',
      'Nenhum': 'None',
      'Mais': 'More',
      'Menos': 'Less',
      'Detalhes': 'Details',
      'Ações': 'Actions',
      'Status': 'Status',
      'Data': 'Date',
      'Tipo': 'Type',
      'Categoria': 'Category',
      'Descrição': 'Description',
      'Título': 'Title',
      'Nome': 'Name',
      'Email': 'Email',
      'Telefone': 'Phone',
      'Endereço': 'Address',
      'Cidade': 'City',
      'Estado': 'State',
      'País': 'Country',
      'CEP': 'ZIP Code',
      'Valor': 'Amount',
      'Total': 'Total',
      'Quantidade': 'Quantity',
      'Preço': 'Price',
      'Desconto': 'Discount',
      'Imposto': 'Tax',
      'Subtotal': 'Subtotal',

      // Navegação
      'Início': 'Home',
      'Dashboard': 'Dashboard',
      'Documentos': 'Documents',
      'Perfil': 'Profile',
      'Configurações': 'Settings',
      'Sair': 'Logout',

      // Documentos
      'Meus Documentos': 'My Documents',
      'Enviar documento': 'Upload document',
      'Buscar documentos': 'Search documents',
      'Nenhum documento encontrado': 'No documents found',
      'Processando documento...': 'Processing document...',
      'Documento processado com sucesso!': 'Document processed successfully!',
      'Erro ao processar documento': 'Error processing document',

      // Status
      'Processando': 'Processing',
      'Analisado': 'Analyzed',
      'Erro': 'Error',
      'Pendente': 'Pending',
      'Aprovado': 'Approved',
      'Rejeitado': 'Rejected',
      'Ativo': 'Active',
      'Inativo': 'Inactive'
    };

    // Aplicar traduções exatas primeiro
    if (translations[text]) {
      return translations[text];
    }

    // Tradução por palavras para textos mais longos
    let translatedText = text;
    Object.entries(translations).forEach(([pt, en]) => {
      const regex = new RegExp(`\\b${pt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      translatedText = translatedText.replace(regex, en);
    });

    return translatedText;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <LanguageIcon className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Page Translator
            </span>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
        
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
          Translate this page to English automatically
        </p>
        
        <div className="flex space-x-2">
          <button
            onClick={translatePage}
            disabled={isTranslating}
            className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white text-sm py-2 px-3 rounded-md transition-colors"
          >
            {isTranslating ? 'Translating...' : 'Translate'}
          </button>
          
          {originalContent && (
            <button
              onClick={restoreOriginalContent}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white text-sm py-2 px-3 rounded-md transition-colors"
            >
              Restore
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageTranslator;