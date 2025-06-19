import React, { createContext, useState, useContext, useEffect } from 'react';

// Criação do contexto
const ThemeContext = createContext();

// Hook personalizado para usar o contexto
export const useTheme = () => useContext(ThemeContext);

// Provedor do contexto
export const ThemeProvider = ({ children }) => {
  // Verificar preferência do sistema ou valor salvo
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      return savedTheme;
    }
    
    // Verificar preferência do sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  };
  
  const [theme, setTheme] = useState(getInitialTheme);
  
  // Atualizar o tema
  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };
  
  // Definir um tema específico
  const setThemeMode = (mode) => {
    if (mode === 'light' || mode === 'dark') {
      localStorage.setItem('theme', mode);
      setTheme(mode);
    }
  };
  
  // Aplicar tema ao elemento HTML
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  // Ouvir mudanças na preferência do sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Só atualizar se não houver preferência salva
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    // Adicionar listener para mudanças
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback para navegadores mais antigos
      mediaQuery.addListener(handleChange);
    }
    
    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback para navegadores mais antigos
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);
  
  // Valores do contexto
  const value = {
    theme,
    toggleTheme,
    setTheme: setThemeMode,
    isDark: theme === 'dark'
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
