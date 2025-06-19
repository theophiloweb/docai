import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  DocumentTextIcon, 
  ChartBarIcon, 
  HeartIcon,
  BanknotesIcon,
  ClipboardDocumentListIcon,
  ArrowRightIcon,
  CreditCardIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';
import { generateGeneralInsights } from '../../services/aiService';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const DashboardPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    documentCount: 0,
    categoryCount: 0,
    storageUsed: '0 MB',
    storageLimit: '100 MB',
    storagePercentage: 0,
    subscription: {
      plan: 'Básico',
      status: 'Ativo',
      price: 'R$ 29,90/mês',
      nextBilling: '2025-07-12T00:00:00Z'
    },
    recentDocuments: [],
    insights: [],
    medicalSummary: {
      totalDocuments: 0,
      lastConsultation: null
    },
    financialSummary: {
      totalDocuments: 0,
      totalExpenses: 0,
      totalIncome: 0
    },
    budgetSummary: {
      totalBudgets: 0,
      pendingBudgets: 0,
      totalAmount: 0
    }
  });

  // Carregar dados do dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/documents/dashboard');
        const dashboardData = response.data.data;
        
        // Garantir que todos os objetos necessários existam
        const processedData = {
          ...dashboardData,
          subscription: dashboardData.subscription || {
            plan: 'Básico',
            status: 'Ativo',
            price: 'R$ 29,90/mês',
            nextBilling: '2025-07-12T00:00:00Z'
          },
          medicalSummary: dashboardData.medicalSummary || {
            totalDocuments: 0,
            lastConsultation: null
          },
          financialSummary: dashboardData.financialSummary || {
            totalDocuments: 0,
            totalExpenses: 0,
            totalIncome: 0
          },
          budgetSummary: dashboardData.budgetSummary || {
            totalBudgets: 0,
            pendingBudgets: 0,
            totalAmount: 0
          },
          insights: dashboardData.insights || [],
          recentDocuments: dashboardData.recentDocuments || []
        };
        
        // Calcular porcentagem de armazenamento usado
        const storageMatch = processedData.storageUsed?.match(/(\d+(\.\d+)?)/);
        const storageValue = storageMatch ? parseFloat(storageMatch[1]) : 0;
        const storageLimit = 100; // 100 MB para plano básico
        const storagePercentage = Math.min(Math.round((storageValue / storageLimit) * 100), 100);
        
        processedData.storageLimit = `${storageLimit} MB`;
        processedData.storagePercentage = storagePercentage;
        
        // Gerar insights usando a IA
        try {
          const insights = await generateGeneralInsights(processedData);
          processedData.insights = insights || [];
        } catch (aiError) {
          console.error('Erro ao gerar insights com IA:', aiError);
          // Manter os insights existentes ou usar fallback
        }
        
        setDashboardData(processedData);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        toast.error('Erro ao carregar dados do dashboard');
        
        // Dados de exemplo para desenvolvimento
        const mockData = {
          documentCount: 35,
          categoryCount: 5,
          storageUsed: '12.5 MB',
          storageLimit: '100 MB',
          storagePercentage: 12.5,
          subscription: {
            plan: 'Básico',
            status: 'Ativo',
            price: 'R$ 29,90/mês',
            nextBilling: '2025-07-12T00:00:00Z'
          },
          recentDocuments: [
            {
              id: '1',
              title: 'Exame de Sangue',
              description: 'Resultado do exame de sangue completo',
              category: 'medical',
              createdAt: '2025-06-01T10:30:00Z'
            },
            {
              id: '2',
              title: 'Fatura de Energia',
              description: 'Fatura de energia elétrica do mês de maio',
              category: 'financial',
              createdAt: '2025-05-28T14:15:00Z'
            },
            {
              id: '3',
              title: 'Orçamento Reforma',
              description: 'Orçamento para reforma da cozinha',
              category: 'budget',
              createdAt: '2025-05-25T09:45:00Z'
            },
            {
              id: '4',
              title: 'Receita Médica',
              description: 'Prescrição de medicamentos',
              category: 'medical',
              createdAt: '2025-05-20T16:30:00Z'
            }
          ],
          medicalSummary: {
            totalDocuments: 15,
            lastConsultation: {
              date: '2025-05-28T14:30:00Z',
              doctorName: 'Dra. Ana Silva',
              specialty: 'Cardiologia'
            }
          },
          financialSummary: {
            totalDocuments: 20,
            totalExpenses: 3250.75,
            totalIncome: 4500.00
          },
          budgetSummary: {
            totalBudgets: 12,
            pendingBudgets: 4,
            totalAmount: 45750.25
          }
        };
        
        // Gerar insights usando a IA mesmo para dados de exemplo
        try {
          const insights = await generateGeneralInsights(mockData);
          mockData.insights = insights || [];
        } catch (aiError) {
          console.error('Erro ao gerar insights com IA para dados de exemplo:', aiError);
          // Usar insights de fallback (já incluídos na função generateGeneralInsights)
        }
        
        setDashboardData(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Função para formatar data
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

  // Função para formatar valor monetário
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return 'R$ 0,00';
    
    try {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    } catch (error) {
      console.error('Erro ao formatar valor monetário:', error);
      return 'R$ 0,00';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
            {t('dashboard.welcome', { name: 'Usuário' })}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Visualize e gerencie seus documentos e insights
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            to="/dashboard/documents"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <CloudArrowUpIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Enviar Documento
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <>
          {/* Seção principal com métricas e assinatura */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Métricas principais */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Documentos e Armazenamento */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Documentos</h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{dashboardData.categoryCount || 0} categorias</span>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-4">
                    <DocumentTextIcon className="h-10 w-10 text-primary-500" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">{dashboardData.documentCount || 0}</div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">documentos enviados</p>
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Armazenamento usado</h4>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                      <div 
                        className="bg-primary-600 h-2.5 rounded-full" 
                        style={{ width: `${dashboardData.storagePercentage || 0}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {dashboardData.storageUsed || '0 MB'} / {dashboardData.storageLimit || '100 MB'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Insights */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Insights</h3>
                  <Link to="#" className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400">
                    Ver todos
                  </Link>
                </div>
                <div className="space-y-4">
                  {(dashboardData.insights || []).slice(0, 2).map((insight, index) => (
                    <div key={insight?.id || index} className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        {insight?.category === 'medical' ? (
                          <HeartIcon className="h-5 w-5 text-red-500" />
                        ) : insight?.category === 'financial' ? (
                          <BanknotesIcon className="h-5 w-5 text-green-500" />
                        ) : insight?.category === 'budget' ? (
                          <ClipboardDocumentListIcon className="h-5 w-5 text-blue-500" />
                        ) : (
                          <ChartBarIcon className="h-5 w-5 text-purple-500" />
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{insight?.title || 'Insight'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{insight?.description || 'Sem descrição disponível'}</p>
                      </div>
                    </div>
                  ))}
                  
                  {(!dashboardData.insights || dashboardData.insights.length === 0) && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum insight disponível no momento.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Assinatura */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Sua Assinatura</h3>
                {dashboardData.subscription && dashboardData.subscription.status && (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    dashboardData.subscription.status === 'Ativo' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {dashboardData.subscription.status}
                  </span>
                )}
              </div>
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24">
                  <CircularProgressbar
                    value={dashboardData.storagePercentage || 0}
                    text={`${dashboardData.storagePercentage || 0}%`}
                    styles={buildStyles({
                      textSize: '16px',
                      pathColor: '#4f46e5',
                      textColor: '#4f46e5',
                      trailColor: '#e5e7eb',
                    })}
                  />
                </div>
              </div>
              <div className="text-center mb-4">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                  {dashboardData.subscription?.plan || 'Plano Básico'}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {dashboardData.subscription?.price || 'R$ 29,90/mês'}
                </p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Próxima cobrança:</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {dashboardData.subscription?.nextBilling ? formatDate(dashboardData.subscription.nextBilling) : '-'}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  to="/dashboard/settings"
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <CreditCardIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" aria-hidden="true" />
                  Gerenciar assinatura
                </Link>
              </div>
            </div>
          </div>

          {/* Seções especializadas */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
            {/* Histórico Médico */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <HeartIcon className="h-6 w-6 text-red-500 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Histórico Médico</h3>
                </div>
                <Link to="/dashboard/medical" className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 flex items-center">
                  Ver detalhes
                  <ArrowRightIcon className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total de documentos médicos</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">
                    {dashboardData.medicalSummary?.totalDocuments || 0}
                  </p>
                </div>
                {dashboardData.medicalSummary?.lastConsultation && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Última consulta</p>
                    <p className="text-md font-medium text-gray-900 dark:text-white">
                      {dashboardData.medicalSummary.lastConsultation.doctorName || ''} - {dashboardData.medicalSummary.lastConsultation.specialty || ''}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {dashboardData.medicalSummary.lastConsultation.date ? formatDate(dashboardData.medicalSummary.lastConsultation.date) : ''}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Financeiro */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <BanknotesIcon className="h-6 w-6 text-green-500 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Financeiro</h3>
                </div>
                <Link to="/dashboard/financial" className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 flex items-center">
                  Ver detalhes
                  <ArrowRightIcon className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total de documentos financeiros</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">
                    {dashboardData.financialSummary?.totalDocuments || 0}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Despesas</p>
                    <p className="text-md font-medium text-red-600 dark:text-red-400">
                      {formatCurrency(dashboardData.financialSummary?.totalExpenses)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receitas</p>
                    <p className="text-md font-medium text-green-600 dark:text-green-400">
                      {formatCurrency(dashboardData.financialSummary?.totalIncome)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Orçamentos */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <ClipboardDocumentListIcon className="h-6 w-6 text-blue-500 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Orçamentos</h3>
                </div>
                <Link to="/dashboard/budget" className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 flex items-center">
                  Ver detalhes
                  <ArrowRightIcon className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total de orçamentos</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">
                    {dashboardData.budgetSummary?.totalBudgets || 0}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pendentes</p>
                    <p className="text-md font-medium text-yellow-600 dark:text-yellow-400">
                      {dashboardData.budgetSummary?.pendingBudgets || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Valor total</p>
                    <p className="text-md font-medium text-gray-900 dark:text-white">
                      {formatCurrency(dashboardData.budgetSummary?.totalAmount)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Documentos recentes */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {t('dashboard.recent.title')}
              </h3>
              <Link to="/dashboard/documents" className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400">
                {t('dashboard.recent.view_all')}
              </Link>
            </div>
            <div className="p-6">
              {(dashboardData.recentDocuments || []).length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {dashboardData.recentDocuments.map((doc) => (
                    <div key={doc.id} className="py-4 flex items-center">
                      <div className="flex-shrink-0">
                        {doc.category === 'medical' ? (
                          <HeartIcon className="h-6 w-6 text-red-500" />
                        ) : doc.category === 'financial' ? (
                          <BanknotesIcon className="h-6 w-6 text-green-500" />
                        ) : doc.category === 'budget' ? (
                          <ClipboardDocumentListIcon className="h-6 w-6 text-blue-500" />
                        ) : (
                          <DocumentTextIcon className="h-6 w-6 text-gray-500" />
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{doc.title || 'Documento sem título'}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{doc.description || 'Sem descrição'}</p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                          {doc.createdAt ? formatDate(doc.createdAt) : '-'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                  Nenhum documento recente encontrado.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
