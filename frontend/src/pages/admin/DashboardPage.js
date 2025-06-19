import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UsersIcon,
  CreditCardIcon,
  ServerIcon,
  ClockIcon,
  // ExclamationTriangleIcon,
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';
import { useTranslation } from 'react-i18next';

// Componente para gráfico simplificado
const SimpleChart = ({ data, title, color }) => {
  const maxValue = Math.max(...data.values);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="flex items-end space-x-2 h-40">
        {data.values.map((value, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div 
              className={`${color} rounded-t w-full`} 
              style={{ height: `${(value / maxValue) * 100}%` }}
            ></div>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{data.labels[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalDocuments: 0,
    processedDocuments: 0,
    totalPlans: 0,
    activePlans: 0,
    systemHealth: 'healthy', // healthy, warning, critical
    onlineUsers: 0,
    recentLogins: [],
    userGrowth: {
      percentage: 12.5,
      trend: 'up' // up, down
    },
    revenueGrowth: {
      percentage: 8.3,
      trend: 'up'
    }
  });
  
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // Dados para gráficos
  const chartData = {
    userGrowth: {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
      values: [45, 52, 68, 74, 83, 96]
    },
    subscriptions: {
      labels: ['Gratuito', 'Básico', 'Profissional', 'Empresarial', 'Familiar'],
      values: [42, 28, 18, 7, 5]
    },
    revenue: {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
      values: [2800, 3200, 3600, 4100, 4500, 5200]
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/dashboard');
        if (response.data.success) {
          setStats(response.data.data);
        } else {
          console.error('Erro ao carregar dados do dashboard:', response.data.message);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    // Carregar dados do dashboard
    fetchDashboardData();
  }, []);

  // Função para formatar data/hora
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Cards de estatísticas
  const statCards = [
    {
      title: t('admin.dashboard.users'),
      value: stats.totalUsers,
      description: `${stats.activeUsers} ${t('admin.dashboard.active_users')}`,
      icon: UsersIcon,
      color: 'bg-blue-500',
      link: '/admin/users',
      growth: stats.userGrowth
    },
    {
      title: t('admin.users.columns.role') === 'Role' ? 'Assinaturas' : t('admin.users.columns.role'),
      value: stats.totalPlans,
      description: `${stats.activePlans} ${t('admin.users.status.active').toLowerCase()}`,
      icon: CreditCardIcon,
      color: 'bg-purple-500',
      link: '/admin/plans',
      growth: stats.revenueGrowth
    },
    {
      title: t('admin.dashboard.system_health'),
      value: stats.systemHealth === 'healthy' ? 'Saudável' : stats.systemHealth === 'warning' ? 'Atenção' : 'Crítico',
      description: `${stats.onlineUsers} ${t('admin.dashboard.active_users')}`,
      icon: ServerIcon,
      color: stats.systemHealth === 'healthy' ? 'bg-green-500' : stats.systemHealth === 'warning' ? 'bg-yellow-500' : 'bg-red-500',
      link: '/admin/logs'
    },
    {
      title: t('admin.settings.ai.title'),
      value: '3 APIs',
      description: 'Todas operacionais',
      icon: ChartBarIcon,
      color: 'bg-indigo-500',
      link: '/admin/settings/ai'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Removido o bloco de verificação de erro, já que a variável error não está mais definida
  // if (error) {
  //   return (
  //     <div className="bg-red-50 dark:bg-red-900 border-l-4 border-red-500 p-4 mb-6">
  //       <div className="flex">
  //         <div className="flex-shrink-0">
  //           <ExclamationTriangleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
  //         </div>
  //         <div className="ml-3">
  //           <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
            {t('admin.dashboard.title')}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t('admin.dashboard.subtitle')}
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <span className="shadow-sm rounded-md">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm leading-5 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:text-gray-500 dark:hover:text-white focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
            >
              {t('common.loading') === 'Loading...' ? 'Atualizar' : t('common.retry')}
            </button>
          </span>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${card.color}`}>
                  <card.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      {card.title}
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">
                        {card.value}
                      </div>
                    </dd>
                    <dd className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {card.description}
                      {card.growth && (
                        <span className={`ml-2 flex items-center text-sm font-medium ${
                          card.growth.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {card.growth.trend === 'up' ? (
                            <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4 mr-1" aria-hidden="true" />
                          ) : (
                            <ArrowDownIcon className="self-center flex-shrink-0 h-4 w-4 mr-1" aria-hidden="true" />
                          )}
                          {card.growth.percentage}%
                        </span>
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Gráficos */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <SimpleChart 
          data={chartData.userGrowth} 
          title={t('admin.dashboard.users')} 
          color="bg-blue-500" 
        />
        <SimpleChart 
          data={chartData.subscriptions} 
          title={t('admin.users.columns.role') === 'Role' ? 'Distribuição de Assinaturas' : t('admin.users.columns.role')} 
          color="bg-purple-500" 
        />
        <SimpleChart 
          data={chartData.revenue} 
          title="Receita Mensal (R$)" 
          color="bg-green-500" 
        />
      </div>

      {/* Seção de usuários recentes */}
      <div className="mt-8">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
          {t('admin.dashboard.recent_logins')}
        </h3>
        <div className="mt-2 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {stats.recentLogins.map((login) => (
              <li key={login.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          login.type === 'admin' ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300' : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                        }`}>
                          <UsersIcon className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {login.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {login.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <span>{formatDateTime(login.time)}</span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 text-right sm:px-6">
            <Link
              to="/admin/logs"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {t('admin.logs.title')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
