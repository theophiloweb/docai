import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Switch } from '@headlessui/react';
import { toast } from 'react-toastify';
import { 
  SunIcon, 
  MoonIcon, 
  GlobeAltIcon, 
  BellIcon, 
  CreditCardIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    documentUpdates: true,
    securityAlerts: true,
    marketingEmails: false
  });
  const [subscription, setSubscription] = useState({
    plan: 'Básico',
    status: 'Ativo',
    price: 'R$ 29,90/mês',
    nextBilling: '2025-07-12T00:00:00Z'
  });
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelStep, setCancelStep] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Carregar configurações do usuário
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/settings');
        if (response.data.success) {
          const settings = response.data.data.settings;
          setNotifications({
            email: settings.notifications?.email ?? true,
            push: settings.notifications?.push ?? false,
            documentUpdates: settings.notifications?.documentUpdates ?? true,
            securityAlerts: settings.notifications?.securityAlerts ?? true,
            marketingEmails: settings.notifications?.marketingEmails ?? false
          });
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    };

    const fetchSubscription = async () => {
      try {
        const response = await api.get('/subscription');
        if (response.data.success) {
          setSubscription(response.data.data.subscription);
        }
      } catch (error) {
        console.error('Erro ao carregar dados da assinatura:', error);
      }
    };

    fetchSettings();
    fetchSubscription();
  }, []);

  // Função para alternar tema
  const handleThemeToggle = () => {
    toggleTheme();
  };

  // Função para alternar idioma
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    i18n.changeLanguage(newLanguage);
  };

  // Função para alternar notificações
  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Função para salvar configurações
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const response = await api.put('/settings', {
        notifications
      });
      
      if (response.data.success) {
        toast.success('Configurações salvas com sucesso!');
      } else {
        toast.error('Erro ao salvar configurações.');
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações. Tente novamente mais tarde.');
    } finally {
      setIsSaving(false);
    }
  };

  // Função para baixar todos os documentos
  const handleDownloadAllDocuments = async () => {
    setIsDownloading(true);
    try {
      const response = await api.get('/documents/download-all', {
        responseType: 'blob'
      });
      
      // Criar link para download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `documentos_${user?.name || 'usuario'}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Download de documentos iniciado!');
      setCancelStep(2);
    } catch (error) {
      console.error('Erro ao baixar documentos:', error);
      toast.error('Erro ao baixar documentos. Tente novamente mais tarde.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Função para cancelar assinatura
  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    try {
      const response = await api.delete('/subscription');
      
      if (response.data.success) {
        toast.success('Assinatura cancelada com sucesso. Sua conta será removida em breve.');
        setShowCancelModal(false);
        // Redirecionar para logout após alguns segundos
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 3000);
      } else {
        toast.error('Erro ao cancelar assinatura.');
      }
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error);
      toast.error('Erro ao cancelar assinatura. Tente novamente mais tarde.');
    } finally {
      setIsCancelling(false);
    }
  };

  // Formatar data
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return '';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
            Configurações
          </h2>
        </div>
      </div>

      <div className="space-y-6">
        {/* Configurações de aparência */}
        <div id="appearance" className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Aparência
            </h3>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
            {/* Tema */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {theme === 'dark' ? (
                  <MoonIcon className="h-6 w-6 text-gray-400 dark:text-gray-300 mr-3" />
                ) : (
                  <SunIcon className="h-6 w-6 text-gray-400 dark:text-gray-300 mr-3" />
                )}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tema escuro
                </span>
              </div>
              <Switch
                checked={theme === 'dark'}
                onChange={handleThemeToggle}
                className={`${
                  theme === 'dark' ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
                } relative inline-flex items-center h-6 rounded-full w-11`}
              >
                <span
                  className={`${
                    theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                  } inline-block w-4 h-4 transform bg-white rounded-full`}
                />
              </Switch>
            </div>

            {/* Idioma */}
            <div className="mt-6">
              <div className="flex items-center mb-2">
                <GlobeAltIcon className="h-6 w-6 text-gray-400 dark:text-gray-300 mr-3" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Idioma
                </span>
              </div>
              <select
                value={i18n.language}
                onChange={handleLanguageChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="pt-BR">Português</option>
                <option value="en-US">English</option>
              </select>
            </div>
          </div>
        </div>

        {/* Configurações de notificações */}
        <div id="notifications" className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Notificações
            </h3>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
            {/* Email */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <BellIcon className="h-6 w-6 text-gray-400 dark:text-gray-300 mr-3" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Notificações por email
                </span>
              </div>
              <Switch
                checked={notifications.email}
                onChange={() => handleNotificationChange('email')}
                className={`${
                  notifications.email ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
                } relative inline-flex items-center h-6 rounded-full w-11`}
              >
                <span
                  className={`${
                    notifications.email ? 'translate-x-6' : 'translate-x-1'
                  } inline-block w-4 h-4 transform bg-white rounded-full`}
                />
              </Switch>
            </div>

            {/* Push */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <BellIcon className="h-6 w-6 text-gray-400 dark:text-gray-300 mr-3" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Notificações push
                </span>
              </div>
              <Switch
                checked={notifications.push}
                onChange={() => handleNotificationChange('push')}
                className={`${
                  notifications.push ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
                } relative inline-flex items-center h-6 rounded-full w-11`}
              >
                <span
                  className={`${
                    notifications.push ? 'translate-x-6' : 'translate-x-1'
                  } inline-block w-4 h-4 transform bg-white rounded-full`}
                />
              </Switch>
            </div>

            {/* Atualizações de documentos */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <BellIcon className="h-6 w-6 text-gray-400 dark:text-gray-300 mr-3" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Atualizações de documentos
                </span>
              </div>
              <Switch
                checked={notifications.documentUpdates}
                onChange={() => handleNotificationChange('documentUpdates')}
                className={`${
                  notifications.documentUpdates ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
                } relative inline-flex items-center h-6 rounded-full w-11`}
              >
                <span
                  className={`${
                    notifications.documentUpdates ? 'translate-x-6' : 'translate-x-1'
                  } inline-block w-4 h-4 transform bg-white rounded-full`}
                />
              </Switch>
            </div>

            {/* Alertas de segurança */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <BellIcon className="h-6 w-6 text-gray-400 dark:text-gray-300 mr-3" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Alertas de segurança
                </span>
              </div>
              <Switch
                checked={notifications.securityAlerts}
                onChange={() => handleNotificationChange('securityAlerts')}
                className={`${
                  notifications.securityAlerts ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
                } relative inline-flex items-center h-6 rounded-full w-11`}
              >
                <span
                  className={`${
                    notifications.securityAlerts ? 'translate-x-6' : 'translate-x-1'
                  } inline-block w-4 h-4 transform bg-white rounded-full`}
                />
              </Switch>
            </div>

            {/* Emails de marketing */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BellIcon className="h-6 w-6 text-gray-400 dark:text-gray-300 mr-3" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Emails de marketing
                </span>
              </div>
              <Switch
                checked={notifications.marketingEmails}
                onChange={() => handleNotificationChange('marketingEmails')}
                className={`${
                  notifications.marketingEmails ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
                } relative inline-flex items-center h-6 rounded-full w-11`}
              >
                <span
                  className={`${
                    notifications.marketingEmails ? 'translate-x-6' : 'translate-x-1'
                  } inline-block w-4 h-4 transform bg-white rounded-full`}
                />
              </Switch>
            </div>
          </div>
        </div>

        {/* Configurações de assinatura */}
        <div id="subscription" className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Assinatura
            </h3>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Plano atual:</span>
                <span className="text-sm text-gray-900 dark:text-white font-semibold">{subscription?.plan || 'Básico'}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
                <span className={`text-sm font-semibold ${
                  subscription?.status === 'Ativo' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'
                }`}>
                  {subscription?.status || 'Ativo'}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Valor:</span>
                <span className="text-sm text-gray-900 dark:text-white">{subscription?.price || 'R$ 29,90/mês'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Próxima cobrança:</span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {subscription?.nextBilling ? formatDate(subscription.nextBilling) : '-'}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <button
                type="button"
                onClick={() => setShowCancelModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Cancelar assinatura
              </button>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Ao cancelar sua assinatura, sua conta e todos os seus dados serão removidos permanentemente.
              </p>
            </div>
          </div>
        </div>

        {/* Botão de salvar */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {isSaving ? 'Salvando...' : 'Salvar configurações'}
          </button>
        </div>
      </div>

      {/* Modal de cancelamento de assinatura */}
      {showCancelModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      {cancelStep === 1 ? 'Cancelar assinatura' : 'Confirmar cancelamento'}
                    </h3>
                    <div className="mt-2">
                      {cancelStep === 1 ? (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Antes de cancelar sua assinatura, recomendamos que você baixe todos os seus documentos. 
                            Após o cancelamento, sua conta e todos os seus dados serão removidos permanentemente.
                          </p>
                          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900 rounded-md">
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                              </div>
                              <div className="ml-3">
                                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                  Atenção
                                </h3>
                                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                                  <p>
                                    Esta ação não pode ser desfeita. Todos os seus documentos e dados serão excluídos permanentemente.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Você baixou seus documentos. Tem certeza que deseja cancelar sua assinatura e excluir sua conta permanentemente?
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {cancelStep === 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={handleDownloadAllDocuments}
                      disabled={isDownloading}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                    >
                      {isDownloading ? (
                        'Baixando...'
                      ) : (
                        <>
                          <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                          Baixar documentos
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCancelStep(2)}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Pular este passo
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleCancelSubscription}
                      disabled={isCancelling}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                    >
                      {isCancelling ? 'Cancelando...' : 'Confirmar cancelamento'}
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setShowCancelModal(false);
                    setCancelStep(1);
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Voltar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
