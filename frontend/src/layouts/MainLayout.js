import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  HomeIcon,
  HeartIcon,
  BanknotesIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

const MainLayout = ({ requireAuth = false }) => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      navigate('/auth/login', { state: { from: location } });
    }
  }, [requireAuth, isAuthenticated, navigate, location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'pt-BR' ? 'en-US' : 'pt-BR';
    i18n.changeLanguage(newLang);
  };

  const navigation = [
    { name: t('nav.home'), href: '/', icon: HomeIcon, requireAuth: false, showInDashboard: false },
    { name: t('nav.about'), href: '/about', icon: null, requireAuth: false, showInDashboard: false },
    { name: t('nav.contact'), href: '/contact', icon: null, requireAuth: false, showInDashboard: false },
    { name: t('nav.dashboard'), href: '/dashboard', icon: HomeIcon, requireAuth: true, showInDashboard: true },
    { name: t('nav.documents'), href: '/dashboard/documents', icon: DocumentTextIcon, requireAuth: true, showInDashboard: true },
    { name: 'Histórico Médico', href: '/dashboard/medical', icon: HeartIcon, requireAuth: true, showInDashboard: true },
    { name: 'Financeiro', href: '/dashboard/financial', icon: BanknotesIcon, requireAuth: true, showInDashboard: true },
    { name: 'Orçamentos', href: '/dashboard/budget', icon: ClipboardDocumentListIcon, requireAuth: true, showInDashboard: true }
  ];

  const userNavigation = [
    { name: t('nav.profile'), href: '/dashboard/profile', icon: UserCircleIcon },
    { name: t('nav.settings'), href: '/dashboard/settings', icon: Cog6ToothIcon },
    { name: t('nav.consents'), href: '/dashboard/consents', icon: ShieldCheckIcon }
  ];

  const filteredNavigation = navigation.filter(item => 
    (!requireAuth && !item.requireAuth) || 
    (requireAuth && item.showInDashboard)
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <nav className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-xl font-bold text-primary-600 dark:text-primary-400">
                  Doc.AI
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {filteredNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      location.pathname === item.href
                        ? 'border-primary-500 text-gray-900 dark:text-white'
                        : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    {item.icon && <item.icon className="h-5 w-5 mr-1" />}
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <button
                onClick={toggleTheme}
                className="p-1 rounded-full text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {theme === 'dark' ? (
                  <SunIcon className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <MoonIcon className="h-6 w-6" aria-hidden="true" />
                )}
              </button>

              <button
                onClick={toggleLanguage}
                className="ml-3 p-1 rounded-full text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {i18n.language === 'pt-BR' ? 'EN' : 'PT'}
              </button>

              {isAuthenticated ? (
                <div className="ml-3 relative">
                  <div>
                    <button
                      onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                      className="bg-white dark:bg-gray-800 rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <span className="sr-only">Open user menu</span>
                      <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300">
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                    </button>
                  </div>
                  {profileMenuOpen && (
                    <div
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu-button"
                    >
                      {userNavigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          role="menuitem"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <item.icon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                          {item.name}
                        </Link>
                      ))}
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                      >
                        <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                        {t('nav.logout')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="ml-3 flex items-center">
                  <Link
                    to="/auth/login"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-600 dark:text-primary-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/auth/register"
                    className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    {t('nav.register')}
                  </Link>
                </div>
              )}
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {filteredNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    location.pathname === item.href
                      ? 'bg-primary-50 dark:bg-primary-900 border-primary-500 text-primary-700 dark:text-primary-300'
                      : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-800 dark:hover:text-gray-200'
                  } block pl-3 pr-4 py-2 border-l-4 text-base font-medium flex items-center`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon && <item.icon className="h-5 w-5 mr-2" />}
                  {item.name}
                </Link>
              ))}
            </div>
            {isAuthenticated ? (
              <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800 dark:text-gray-200">{user?.name}</div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{user?.email}</div>
                  </div>
                  <div className="ml-auto flex space-x-2">
                    <button
                      onClick={toggleTheme}
                      className="p-1 rounded-full text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      {theme === 'dark' ? (
                        <SunIcon className="h-6 w-6" aria-hidden="true" />
                      ) : (
                        <MoonIcon className="h-6 w-6" aria-hidden="true" />
                      )}
                    </button>
                    <button
                      onClick={toggleLanguage}
                      className="p-1 rounded-full text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      {i18n.language === 'pt-BR' ? 'EN' : 'PT'}
                    </button>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  {userNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="flex items-center px-4 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                      {item.name}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                    {t('nav.logout')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-around px-4">
                  <Link
                    to="/auth/login"
                    className="flex-1 text-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-primary-600 dark:text-primary-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/auth/register"
                    className="flex-1 ml-3 text-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.register')}
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </nav>

      <main className="flex-grow py-6">
        <Outlet />
      </main>

      <footer className="bg-white dark:bg-gray-800 shadow mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} Doc.AI. Todos os direitos reservados.
              </p>
            </div>
            <div className="flex space-x-6">
              <Link to="/privacy-policy" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                Política de Privacidade
              </Link>
              <Link to="/terms-of-service" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                Termos de Serviço
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
