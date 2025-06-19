import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheckIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { Switch } from '@headlessui/react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const ConsentManagementPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [consentHistory, setConsentHistory] = useState([]);
  
  // Estado para os consentimentos
  const [consents, setConsents] = useState({
    data_processing: true, // Obrigatório para o funcionamento do serviço
    ai_processing: true,
    marketing_emails: false,
    third_party_sharing: false
  });

  // Inicializar componente
  useEffect(() => {
    // Componente montado
  }, [t]);

  // Carregar consentimentos do usuário
  useEffect(() => {
    const fetchConsents = async () => {
      try {
        setLoading(true);
        const response = await api.get('/users/consents');
        setConsents(response.data.data.consents);
      } catch (error) {
        console.error('Erro ao carregar consentimentos:', error);
        toast.error('Erro ao carregar consentimentos');
      } finally {
        setLoading(false);
      }
    };

    fetchConsents();
  }, [t]);

  // Carregar histórico de consentimentos
  const loadConsentHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/consents/history');
      setConsentHistory(response.data.data.history);
      setShowHistory(true);
    } catch (error) {
      console.error('Erro ao carregar histórico de consentimentos:', error);
      toast.error('Erro ao carregar histórico de consentimentos');
    } finally {
      setLoading(false);
    }
  };

  // Atualizar consentimentos
  const handleSaveConsents = async () => {
    try {
      setSaving(true);
      await api.put('/users/consents', { consents });
      toast.success('Preferências de consentimento atualizadas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar consentimentos:', error);
      toast.error('Erro ao atualizar preferências de consentimento');
    } finally {
      setSaving(false);
    }
  };

  // Função para alternar consentimento
  const toggleConsent = (key) => {
    // Não permitir desativar o processamento de dados (obrigatório)
    if (key === 'data_processing') return;
    
    setConsents(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
            {t('consents.title')}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t('consents.description')}
          </p>
        </div>
      </div>

      {/* Alerta LGPD */}
      <div className="bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <InformationCircleIcon className="h-5 w-5 text-blue-500" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              De acordo com o Art. 8º da LGPD, o consentimento deve ser livre, informado e inequívoco. 
              Você pode revogar seu consentimento a qualquer momento.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Preferências de Consentimento
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                Gerencie como seus dados são utilizados em nossa plataforma
              </p>
            </div>
            <ShieldCheckIcon className="h-8 w-8 text-primary-500 dark:text-primary-400" />
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700">
            <dl>
              {/* Processamento de dados pessoais */}
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">
                  {t('consents.data_processing.title')}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2 flex justify-between items-center">
                  <div>
                    <p>{t('consents.data_processing.description')}</p>
                    <p className="mt-1 text-xs text-primary-600 dark:text-primary-400">
                      {t('consents.data_processing.required')}
                    </p>
                  </div>
                  <Switch
                    checked={consents.data_processing}
                    onChange={() => {}}
                    disabled={true}
                    className={`${
                      consents.data_processing ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        consents.data_processing ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </dd>
              </div>
              
              {/* Processamento por IA */}
              <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">
                  {t('consents.ai_processing.title')}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2 flex justify-between items-center">
                  <p>{t('consents.ai_processing.description')}</p>
                  <Switch
                    checked={consents.ai_processing}
                    onChange={() => toggleConsent('ai_processing')}
                    className={`${
                      consents.ai_processing ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        consents.ai_processing ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </dd>
              </div>
              
              {/* Comunicações de marketing */}
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">
                  {t('consents.marketing_emails.title')}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2 flex justify-between items-center">
                  <p>{t('consents.marketing_emails.description')}</p>
                  <Switch
                    checked={consents.marketing_emails}
                    onChange={() => toggleConsent('marketing_emails')}
                    className={`${
                      consents.marketing_emails ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        consents.marketing_emails ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </dd>
              </div>
              
              {/* Compartilhamento com terceiros */}
              <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">
                  {t('consents.third_party_sharing.title')}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2 flex justify-between items-center">
                  <p>{t('consents.third_party_sharing.description')}</p>
                  <Switch
                    checked={consents.third_party_sharing}
                    onChange={() => toggleConsent('third_party_sharing')}
                    className={`${
                      consents.third_party_sharing ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        consents.third_party_sharing ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </dd>
              </div>
              
              {/* Histórico de consentimentos */}
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">
                  {t('consents.history.title')}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                  {!showHistory ? (
                    <button
                      onClick={loadConsentHistory}
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-500 font-medium"
                    >
                      {t('consents.history.show')}
                    </button>
                  ) : (
                    consentHistory.length > 0 ? (
                      <div className="border border-gray-200 dark:border-gray-600 rounded-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                          <thead className="bg-gray-100 dark:bg-gray-600">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {t('consents.history.consent')}
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {t('consents.history.status')}
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {t('consents.history.date')}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                            {consentHistory.map((item, index) => (
                              <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                  {item.type}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    item.granted 
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                  }`}>
                                    {item.granted ? t('consents.history.granted') : t('consents.history.revoked')}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  {new Date(item.date).toLocaleDateString('pt-BR')}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p>Nenhum histórico de consentimento disponível.</p>
                    )
                  )}
                </dd>
              </div>
            </dl>
          </div>
          
          <div className="px-4 py-5 sm:px-6 flex justify-end">
            <button
              type="button"
              onClick={handleSaveConsents}
              disabled={saving}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {saving ? t('common.loading') : t('consents.save')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsentManagementPage;
