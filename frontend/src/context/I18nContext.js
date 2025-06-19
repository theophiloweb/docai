import React, { createContext, useContext, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importar recursos de tradução
import translationPT from '../locales/pt-BR.json';
import translationEN from '../locales/en-US.json';

// Recursos de tradução
const resources = {
  'pt-BR': {
    translation: translationPT
  },
  'en-US': {
    translation: translationEN
  }
};

// Configuração do i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt-BR',
    supportedLngs: ['pt-BR', 'en-US'],
    interpolation: {
      escapeValue: false // React já escapa os valores
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

// Criação do contexto
const I18nContext = createContext();

// Hook personalizado para usar o contexto
export const useI18n = () => useContext(I18nContext);

// Provedor do contexto
export const I18nProvider = ({ children }) => {
  const { t, i18n } = useTranslation();
  
  // Mudar idioma
  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };
  
  // Atualizar o atributo lang do HTML quando o idioma mudar
  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);
  
  // Valores do contexto
  const value = {
    t,
    i18n,
    changeLanguage,
    currentLanguage: i18n.language,
    languages: [
      { code: 'pt-BR', name: 'Português' },
      { code: 'en-US', name: 'English' }
    ]
  };
  
  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

export default I18nContext;
