import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  RadialLinearScale
} from 'chart.js';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

/**
 * Componente para exibir gráficos analíticos de orçamentos
 */
const BudgetAnalyticsCharts = ({ budgets, budgetGroups }) => {
  const { t } = useTranslation();

  // Formatar valor monetário
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  // Preparar dados para gráfico de categorias
  const prepareCategoryData = () => {
    const categories = {};
    
    budgets.forEach(budget => {
      const category = budget.category || 'outros';
      if (!categories[category]) {
        categories[category] = 0;
      }
      categories[category]++;
    });
    
    const labels = Object.keys(categories);
    const data = Object.values(categories);
    
    const backgroundColors = [
      'rgba(54, 162, 235, 0.6)',
      'rgba(75, 192, 192, 0.6)',
      'rgba(255, 206, 86, 0.6)',
      'rgba(255, 99, 132, 0.6)',
      'rgba(153, 102, 255, 0.6)',
      'rgba(255, 159, 64, 0.6)',
      'rgba(201, 203, 207, 0.6)'
    ];
    
    return {
      labels,
      datasets: [
        {
          label: t('budget.budgetsByCategory'),
          data,
          backgroundColor: backgroundColors.slice(0, labels.length),
          borderColor: backgroundColors.map(color => color.replace('0.6', '1')),
          borderWidth: 1
        }
      ]
    };
  };

  // Preparar dados para gráfico de faixas de preço
  const preparePriceRangeData = () => {
    // Definir faixas de preço
    const ranges = [
      { max: 500, label: 'R$ 0 - R$ 500' },
      { max: 1000, label: 'R$ 501 - R$ 1.000' },
      { max: 2000, label: 'R$ 1.001 - R$ 2.000' },
      { max: 5000, label: 'R$ 2.001 - R$ 5.000' },
      { max: Infinity, label: '> R$ 5.000' }
    ];
    
    // Contar orçamentos por faixa de preço
    const counts = Array(ranges.length).fill(0);
    
    budgets.forEach(budget => {
      const price = parseFloat(budget.totalAmount || 0);
      for (let i = 0; i < ranges.length; i++) {
        if (price <= ranges[i].max) {
          counts[i]++;
          break;
        }
      }
    });
    
    const labels = ranges.map(r => r.label);
    
    return {
      labels,
      datasets: [
        {
          label: t('budget.budgetsByPriceRange'),
          data: counts,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1
        }
      ]
    };
  };

  // Preparar dados para gráfico de fornecedores mais frequentes
  const prepareProviderData = () => {
    const providers = {};
    
    budgets.forEach(budget => {
      const provider = budget.provider || t('budget.unknownProvider');
      if (!providers[provider]) {
        providers[provider] = 0;
      }
      providers[provider]++;
    });
    
    // Ordenar por frequência e pegar os top 5
    const sortedProviders = Object.entries(providers)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    const labels = sortedProviders.map(([provider]) => provider);
    const data = sortedProviders.map(([, count]) => count);
    
    return {
      labels,
      datasets: [
        {
          label: t('budget.quotesByProvider'),
          data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 206, 86)',
            'rgb(75, 192, 192)',
            'rgb(153, 102, 255)'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  // Preparar dados para gráfico de preço médio por grupo
  const prepareAveragePriceData = () => {
    const groupData = {};
    
    // Calcular preço médio por grupo
    Object.entries(budgetGroups).forEach(([groupTitle, budgets]) => {
      if (budgets.length > 0) {
        const sum = budgets.reduce((total, budget) => total + parseFloat(budget.totalAmount || 0), 0);
        const average = sum / budgets.length;
        groupData[groupTitle] = average;
      }
    });
    
    // Ordenar por preço médio e pegar os top 5
    const sortedGroups = Object.entries(groupData)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    const labels = sortedGroups.map(([group]) => group);
    const data = sortedGroups.map(([, avg]) => avg);
    
    return {
      labels,
      datasets: [
        {
          label: t('budget.averagePriceByGroup'),
          data,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1
        }
      ]
    };
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {t('budget.analyticsAndInsights')}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfico de orçamentos por categoria */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {t('budget.budgetsByCategory')}
          </h4>
          <div className="h-64">
            <Doughnut 
              data={prepareCategoryData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                    labels: {
                      color: document.documentElement.classList.contains('dark') ? 'white' : 'black'
                    }
                  }
                }
              }}
            />
          </div>
        </div>
        
        {/* Gráfico de orçamentos por faixa de preço */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {t('budget.budgetsByPriceRange')}
          </h4>
          <div className="h-64">
            <Bar 
              data={preparePriceRangeData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      color: document.documentElement.classList.contains('dark') ? 'white' : 'black'
                    }
                  },
                  x: {
                    ticks: {
                      color: document.documentElement.classList.contains('dark') ? 'white' : 'black'
                    }
                  }
                }
              }}
            />
          </div>
        </div>
        
        {/* Gráfico de fornecedores mais frequentes */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {t('budget.topProviders')}
          </h4>
          <div className="h-64">
            <Pie 
              data={prepareProviderData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                    labels: {
                      color: document.documentElement.classList.contains('dark') ? 'white' : 'black'
                    }
                  }
                }
              }}
            />
          </div>
        </div>
        
        {/* Gráfico de preço médio por grupo */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {t('budget.averagePriceByGroup')}
          </h4>
          <div className="h-64">
            <Bar 
              data={prepareAveragePriceData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return formatCurrency(context.raw);
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return formatCurrency(value);
                      },
                      color: document.documentElement.classList.contains('dark') ? 'white' : 'black'
                    }
                  },
                  x: {
                    ticks: {
                      color: document.documentElement.classList.contains('dark') ? 'white' : 'black'
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetAnalyticsCharts;
