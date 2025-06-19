import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, SunIcon, MoonIcon, LanguageIcon } from '@heroicons/react/24/outline';

const LandingLayout = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { currentLanguage, languages, changeLanguage } = useI18n();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  // Monitorar scroll para mudar estilo do cabeçalho
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Links de navegação
  const navigation = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.about'), href: '/sobre' },
    { name: t('nav.contact'), href: '/contato' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Cabeçalho */}
      <Disclosure as="nav" 
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white dark:bg-gray-800 shadow-nav' 
            : 'bg-transparent'
        }`}
      >
        {({ open }) => (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  {/* Logo */}
                  <Link to="/" className="flex-shrink-0 flex items-center">
                    <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {t('app.name')}
                    </span>
                  </Link>
                  
                  {/* Links de navegação - Desktop */}
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    {navigation.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                          location.pathname === item.href
                            ? 'border-primary-500 text-gray-900 dark:text-white'
                            : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
                
                {/* Botões de ação - Desktop */}
                <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
                  {/* Seletor de tema */}
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {theme === 'dark' ? (
                      <SunIcon className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <MoonIcon className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                  
                  {/* Seletor de idioma */}
                  <Menu as="div" className="relative">
                    <Menu.Button className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <LanguageIcon className="h-5 w-5" aria-hidden="true" />
                    </Menu.Button>
                    <Transition
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {languages.map((lang) => (
                          <Menu.Item key={lang.code}>
                            {({ active }) => (
                              <button
                                onClick={() => changeLanguage(lang.code)}
                                className={`${
                                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                                } ${
                                  currentLanguage === lang.code ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'
                                } block px-4 py-2 text-sm w-full text-left`}
                              >
                                {lang.name}
                              </button>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                  
                  {/* Botões de login e cadastro */}
                  <Link
                    to="/login"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/cadastro"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    {t('nav.register')}
                  </Link>
                </div>
                
                {/* Menu mobile */}
                <div className="-mr-2 flex items-center sm:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
                    <span className="sr-only">Abrir menu principal</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            {/* Menu mobile */}
            <Disclosure.Panel className="sm:hidden bg-white dark:bg-gray-800 shadow-lg">
              <div className="pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.href}
                    as={Link}
                    to={item.href}
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                      location.pathname === item.href
                        ? 'border-primary-500 bg-primary-50 dark:bg-gray-700 text-primary-700 dark:text-primary-400'
                        : 'border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
              
              {/* Ações mobile */}
              <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between px-4">
                  <div className="flex items-center space-x-4">
                    {/* Seletor de tema */}
                    <button
                      onClick={toggleTheme}
                      className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {theme === 'dark' ? (
                        <SunIcon className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <MoonIcon className="h-5 w-5" aria-hidden="true" />
                      )}
                    </button>
                    
                    {/* Seletor de idioma */}
                    <Menu as="div" className="relative">
                      <Menu.Button className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <LanguageIcon className="h-5 w-5" aria-hidden="true" />
                      </Menu.Button>
                      <Transition
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {languages.map((lang) => (
                            <Menu.Item key={lang.code}>
                              {({ active }) => (
                                <button
                                  onClick={() => changeLanguage(lang.code)}
                                  className={`${
                                    active ? 'bg-gray-100 dark:bg-gray-700' : ''
                                  } ${
                                    currentLanguage === lang.code ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'
                                  } block px-4 py-2 text-sm w-full text-left`}
                                >
                                  {lang.name}
                                </button>
                              )}
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
                
                <div className="mt-3 space-y-1">
                  <Disclosure.Button
                    as={Link}
                    to="/login"
                    className="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {t('nav.login')}
                  </Disclosure.Button>
                  <Disclosure.Button
                    as={Link}
                    to="/cadastro"
                    className="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {t('nav.register')}
                  </Disclosure.Button>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* Conteúdo principal */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Rodapé */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start space-x-6">
              <Link to="/" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Home</span>
                <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                  {t('app.name')}
                </span>
              </Link>
            </div>
            <div className="mt-8 md:mt-0">
              <p className="text-center text-base text-gray-500 dark:text-gray-400">
                {t('footer.rights', { year: new Date().getFullYear() })}
              </p>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8 md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              <Link to="/termos-servico" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300">
                {t('footer.terms')}
              </Link>
              <Link to="/politica-privacidade" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300">
                {t('footer.privacy')}
              </Link>
              <Link to="/contato" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300">
                {t('footer.contact')}
              </Link>
            </div>
            <p className="mt-8 text-base text-gray-500 dark:text-gray-400 md:mt-0 md:order-1">
              {t('app.tagline')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingLayout;
