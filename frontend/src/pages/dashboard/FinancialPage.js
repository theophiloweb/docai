import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  BanknotesIcon, 
  DocumentTextIcon, 
  ReceiptPercentIcon, 
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowUpTrayIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
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
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import api from '../../services/api';
import { toast } from 'react-toastify';

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
  ArcElement
);

const FinancialPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [financialData, setFinancialData] = useState({
    summary: {
      totalDocuments: 0,
      invoices: 0,
      receipts: 0,
      bankStatements: 0,
      totalExpenses: 0,
      totalIncome: 0
    },
    latestTransactions: [],
    monthlyExpenses: {
      labels: [],
      datasets: []
    },
    expensesByCategory: {
      labels: [],
      datasets: []
    },
    incomeVsExpense: {
      labels: [],
      datasets: []
    }
  });
  
  // Carregar dados financeiros
  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/financial/dashboard');
        
        // Verificar se os dados retornados são válidos
        const data = response.data.data;
        
        // Garantir que todos os objetos de gráfico tenham propriedades labels e datasets
        const safeData = {
          ...data,
          monthlyExpenses: data.monthlyExpenses || {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
            datasets: [{
              label: 'Despesas',
              data: [0, 0, 0, 0, 0, 0],
              backgroundColor: 'rgba(255, 99, 132, 0.5)'
            }]
          },
          expensesByCategory: data.expensesByCategory || {
            labels: ['Sem dados'],
            datasets: [{
              label: 'Despesas por Categoria',
              data: [0],
              backgroundColor: ['rgba(201, 203, 207, 0.7)'],
              borderColor: ['rgb(201, 203, 207)'],
              borderWidth: 1
            }]
          },
          incomeVsExpense: data.incomeVsExpense || {
            labels: ['Receitas', 'Despesas', 'Saldo'],
            datasets: [{
              label: 'Valor (R$)',
              data: [0, 0, 0],
              backgroundColor: [
                'rgba(75, 192, 192, 0.7)',
                'rgba(255, 99, 132, 0.7)',
                'rgba(255, 206, 86, 0.7)'
              ]
            }]
          },
          aiAnalysis: data.aiAnalysis || {
            monthlyExpenses: "Não há análise disponível para este período.",
            cashFlow: "Não há análise disponível para este período.",
            categories: "Não há análise disponível para este período."
          }
        };
        
        setFinancialData(safeData);
      } catch (error) {
        console.error('Erro ao carregar dados financeiros:', error);
        toast.error('Erro ao carregar dados financeiros');
        
        // Dados de exemplo para desenvolvimento
        setFinancialData({
          summary: {
            totalDocuments: 20,
            invoices: 8,
            receipts: 7,
            bankStatements: 5,
            totalExpenses: 3250.75,
            totalIncome: 4500.00
          },
          latestTransactions: [
            {
              id: '1',
              date: '2025-06-01T10:30:00Z',
              description: 'Pagamento de Salário',
              amount: 4500.00,
              type: 'income',
              category: 'Salário'
            },
            {
              id: '2',
              date: '2025-05-28T14:15:00Z',
              description: 'Aluguel',
              amount: 1200.00,
              type: 'expense',
              category: 'Moradia'
            },
            {
              id: '3',
              date: '2025-06-05T10:30:00Z',
              description: 'Supermercado Extra',
              amount: 235.47,
              category: 'alimentacao',
              isExpense: true
            },
            {
              id: '4',
              date: '2025-06-03T14:15:00Z',
              description: 'Salário',
              amount: 4500.00,
              category: 'salario',
              isExpense: false
            },
            {
              id: '5',
              date: '2025-06-02T09:45:00Z',
              description: 'Conta de Luz',
              amount: 187.32,
              category: 'moradia',
              isExpense: true
            },
            {
              id: '6',
              date: '2025-05-28T16:20:00Z',
              description: 'Farmácia',
              amount: 98.75,
              category: 'saude',
              isExpense: true
            },
            {
              id: '7',
              date: '2025-05-25T11:10:00Z',
              description: 'Restaurante',
              amount: 125.90,
              category: 'alimentacao',
              isExpense: true
            }
          ],
          monthlyExpenses: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
            datasets: [
              {
                label: 'Despesas Mensais',
                data: [2800, 3100, 2950, 3200, 3050, 3250],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 1
              }
            ]
          },
          expensesByCategory: {
            labels: ['Alimentação', 'Moradia', 'Transporte', 'Saúde', 'Educação', 'Lazer', 'Outros'],
            datasets: [
              {
                label: 'Despesas por Categoria',
                data: [850, 1200, 450, 320, 280, 150, 200],
                backgroundColor: [
                  'rgba(255, 99, 132, 0.7)',
                  'rgba(54, 162, 235, 0.7)',
                  'rgba(255, 206, 86, 0.7)',
                  'rgba(75, 192, 192, 0.7)',
                  'rgba(153, 102, 255, 0.7)',
                  'rgba(255, 159, 64, 0.7)',
                  'rgba(201, 203, 207, 0.7)'
                ],
                borderColor: [
                  'rgb(255, 99, 132)',
                  'rgb(54, 162, 235)',
                  'rgb(255, 206, 86)',
                  'rgb(75, 192, 192)',
                  'rgb(153, 102, 255)',
                  'rgb(255, 159, 64)',
                  'rgb(201, 203, 207)'
                ],
                borderWidth: 1
              }
            ]
          },
          incomeVsExpense: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
            datasets: [
              {
                label: 'Receitas',
                data: [4500, 4500, 4500, 4500, 4500, 4500],
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 1
              },
              {
                label: 'Despesas',
                data: [2800, 3100, 2950, 3200, 3050, 3250],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 1
              }
            ]
          },
          aiAnalysis: {
            monthlyExpenses: "Suas despesas mensais têm se mantido relativamente estáveis nos últimos 6 meses, com uma leve tendência de aumento (aproximadamente 2.5% ao mês). O mês de abril apresentou o maior gasto.",
            categories: "Moradia representa sua maior despesa (37% do total), seguida por alimentação (26%). Há oportunidade de economia nas categorias de lazer e transporte, que estão acima da média para seu perfil.",
            cashFlow: "Seu fluxo de caixa está positivo, com uma média de economia mensal de R$ 1.350,00. Recomenda-se manter um fundo de emergência equivalente a pelo menos 3 meses de despesas."
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, []);

  // Opções para gráficos
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
          }
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '70%'
  };

  // Formatar data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Formatar valor monetário
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
            Financeiro
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Visualize e gerencie suas finanças pessoais
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <>
          {/* Cards de resumo */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6 mb-6">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DocumentTextIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Total de Documentos
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900 dark:text-white">
                          {financialData.summary.totalDocuments}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ReceiptPercentIcon className="h-6 w-6 text-blue-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Faturas
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900 dark:text-white">
                          {financialData.summary.invoices}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DocumentTextIcon className="h-6 w-6 text-yellow-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Recibos
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900 dark:text-white">
                          {financialData.summary.receipts}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BanknotesIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Extratos
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900 dark:text-white">
                          {financialData.summary.bankStatements}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ArrowTrendingDownIcon className="h-6 w-6 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Despesas
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900 dark:text-white">
                          {formatCurrency(financialData.summary.totalExpenses)}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ArrowTrendingUpIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Receitas
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900 dark:text-white">
                          {formatCurrency(financialData.summary.totalIncome)}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gráficos e análises */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
            {/* Gráfico de despesas mensais */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                Despesas Mensais
              </h3>
              <div className="h-64">
                <Bar options={barOptions} data={financialData.monthlyExpenses} />
              </div>
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Análise de IA
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {financialData.aiAnalysis?.monthlyExpenses || "Não há análise disponível para este período."}
                </p>
              </div>
            </div>

            {/* Gráfico de receitas vs despesas */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                Receitas vs Despesas
              </h3>
              <div className="h-64">
                <Bar options={barOptions} data={financialData.incomeVsExpense} />
              </div>
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Análise de IA
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {financialData.aiAnalysis?.cashFlow || "Não há análise disponível para este período."}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
            {/* Gráfico de despesas por categoria */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                Despesas por Categoria
              </h3>
              <div className="h-64 flex items-center justify-center">
                <Doughnut options={doughnutOptions} data={financialData.expensesByCategory} />
              </div>
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Análise de IA
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {financialData.aiAnalysis?.categories || "Não há análise disponível para este período."}
                </p>
              </div>
            </div>

            {/* Lista de transações recentes */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Transações Recentes
                </h3>
                <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                  Ver todas
                </a>
              </div>
              <div className="overflow-hidden">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {financialData.latestTransactions.map((transaction) => (
                    <li key={transaction.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <span className={`inline-flex items-center justify-center h-10 w-10 rounded-full ${
                            transaction.isExpense 
                              ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                              : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          }`}>
                            {transaction.isExpense ? (
                              <ArrowTrendingDownIcon className="h-6 w-6" aria-hidden="true" />
                            ) : (
                              <ArrowTrendingUpIcon className="h-6 w-6" aria-hidden="true" />
                            )}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {transaction.description}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {formatDate(transaction.date)} • {transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}
                          </p>
                        </div>
                        <div className={`text-sm font-medium ${
                          transaction.isExpense 
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-green-600 dark:text-green-400'
                        }`}>
                          {transaction.isExpense ? '-' : '+'}{formatCurrency(transaction.amount)}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FinancialPage;
