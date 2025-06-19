import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

const AuthLayout = () => {
  const { i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'pt-BR' ? 'en-US' : 'pt-BR';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <nav className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-12">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-primary-600 dark:text-primary-400">
                Doc.AI
              </Link>
            </div>
            <div className="flex items-center">
              <button
                onClick={toggleTheme}
                className="p-1 rounded-full text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {theme === 'dark' ? (
                  <SunIcon className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <MoonIcon className="h-5 w-5" aria-hidden="true" />
                )}
              </button>

              <button
                onClick={toggleLanguage}
                className="ml-3 p-1 rounded-full text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {i18n.language === 'pt-BR' ? 'EN' : 'PT'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-grow flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Outlet />
        </div>
      </div>

      <footer className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-1 md:mb-0">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} Doc.AI. Todos os direitos reservados.
              </p>
            </div>
            <div className="flex space-x-4">
              <Link to="/politica-de-privacidade" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                Política de Privacidade
              </Link>
              <Link to="/termos-de-servico" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                Termos de Serviço
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
