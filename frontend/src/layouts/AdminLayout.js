import React, { useState } from 'react';
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
  UsersIcon,
  HomeIcon,
  ClipboardDocumentListIcon,
  ServerIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

const AdminLayout = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const toggleLanguage = () => {
    const newLang = t('language') === 'pt-BR' ? 'en-US' : 'pt-BR';
    // Implementar mudança de idioma
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: HomeIcon },
    { name: 'Usuários', href: '/admin/users', icon: UsersIcon },
    { name: 'Planos', href: '/admin/plans', icon: CurrencyDollarIcon },
    { name: 'Configurações', href: '/admin/settings', icon: Cog6ToothIcon },
    { name: 'Logs', href: '/admin/logs', icon: ClipboardDocumentListIcon },
    { name: 'Configurações de IA', href: '/admin/ai-settings', icon: ServerIcon }
  ];

  const userNavigation = [
    { name: 'Perfil', href: '/admin/profile', icon: UserCircleIcon },
    { name: 'Configurações', href: '/admin/settings', icon: Cog6ToothIcon }
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Mobile sidebar */}
      <div className="md:hidden">
        {sidebarOpen && (
          <div className="fixed inset-0 flex z-40">
            <div className="fixed inset-0">
              <div className="absolute inset-0 bg-gray-600 dark:bg-gray-900 opacity-75" onClick={() => setSidebarOpen(false)}></div>
            </div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800 shadow-xl">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </button>
              </div>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <Link to="/admin" className="text-xl font-bold text-primary-600 dark:text-primary-400">
                    Doc.AI Admin
                  </Link>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        location.pathname === item.href
                          ? 'bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                      } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon
                        className={`${
                          location.pathname === item.href
                            ? 'text-primary-500 dark:text-primary-400'
                            : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'
                        } mr-4 flex-shrink-0 h-6 w-6`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center">
                  <div>
                    <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300">
                      {user?.name?.charAt(0) || 'A'}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-base font-medium text-gray-700 dark:text-gray-200">{user?.name || 'Admin'}</p>
                    <button
                      onClick={handleLogout}
                      className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      Sair
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 w-14">{/* Force sidebar to shrink to fit close icon */}</div>
          </div>
        )}
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white dark:bg-gray-800 shadow">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <Link to="/admin" className="text-xl font-bold text-primary-600 dark:text-primary-400">
                  Doc.AI Admin
                </Link>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      location.pathname === item.href
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <item.icon
                      className={`${
                        location.pathname === item.href
                          ? 'text-primary-500 dark:text-primary-400'
                          : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'
                      } mr-3 flex-shrink-0 h-6 w-6`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex-shrink-0 w-full group block">
                <div className="flex items-center">
                  <div>
                    <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300">
                      {user?.name?.charAt(0) || 'A'}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{user?.name || 'Admin'}</p>
                    <button
                      onClick={handleLogout}
                      className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      Sair
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="flex justify-between items-center pb-5 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {navigation.find((item) => item.href === location.pathname)?.name || 'Admin'}
                </h1>
                <div className="flex items-center">
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
                    {t('language') === 'pt-BR' ? 'EN' : 'PT'}
                  </button>

                  <div className="ml-3 relative">
                    <div>
                      <button
                        onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                        className="max-w-xs bg-white dark:bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        id="user-menu-button"
                        aria-expanded="false"
                        aria-haspopup="true"
                      >
                        <span className="sr-only">Open user menu</span>
                        <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300">
                          {user?.name?.charAt(0) || 'A'}
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
                          Sair
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="py-4">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
