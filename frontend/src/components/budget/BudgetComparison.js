import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  DocumentTextIcon, 
  CurrencyDollarIcon, 
  ShieldCheckIcon, 
  TruckIcon,
  ClockIcon,
  StarIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { Bar, Radar } from 'react-chartjs-2';

/**
 * Componente para comparação de orçamentos
 */
const BudgetComparison = ({ budgets }) => {
  const { t } = useTranslation();
  const [scoredBudgets, setScoredBudgets] = useState([]);
  const [bestBudget, setBestBudget] = useState(null);

  // Formatar valor monetário
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  // Formatar data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Calcular scores para cada orçamento
  useEffect(() => {
    if (budgets && budgets.length >= 2) {
      const calculatedScores = calculateScores(budgets);
      setScoredBudgets(calculatedScores);
      
      // Ordenar por score total e obter o melhor
      const sortedBudgets = [...calculatedScores].sort((a, b) => b.scores.total - a.scores.total);
      setBestBudget(sortedBudgets[0]);
    }
  }, [budgets]);

  // Calcular scores para cada orçamento
  const calculateScores = (budgets) => {
    if (!budgets || budgets.length === 0) return [];
    
    return budgets.map(budget => {
      // Garantir que todos os valores necessários existam
      const safeReclameAquiScore = budget.reclameAquiScore || 0;
      const safeProductRating = budget.productRating || 0;
      const safeWarrantyMonths = budget.warrantyMonths || 0;
      const safeDeliveryTime = budget.deliveryTime || 0;
      
      // Pesos para cada critério
      const weights = {
        price: 0.35,
        warranty: 0.15,
        delivery: 0.15,
        reclameAqui: 0.20,
        productRating: 0.15
      };
      
      // Normalizar valores (quanto maior melhor)
      const minPrice = Math.min(...budgets.map(b => b.totalAmount || 0));
      const maxPrice = Math.max(...budgets.map(b => b.totalAmount || 0));
      const priceRange = maxPrice - minPrice;
      
      const priceScore = priceRange === 0 ? 1 : (maxPrice - (budget.totalAmount || 0)) / priceRange;
      const warrantyScore = safeWarrantyMonths / Math.max(...budgets.map(b => b.warrantyMonths || 0) || 1);
      const deliveryScore = (Math.max(...budgets.map(b => b.deliveryTime || 0)) - safeDeliveryTime) / 
                           (Math.max(...budgets.map(b => b.deliveryTime || 0)) - Math.min(...budgets.map(b => b.deliveryTime || 0)) || 1);
      const reclameAquiScore = safeReclameAquiScore / 10; // Normalizado para 0-1
      const productRatingScore = safeProductRating / 5; // Normalizado para 0-1
      
      // Calcular score total
      const totalScore = (
        priceScore * weights.price +
        warrantyScore * weights.warranty +
        deliveryScore * weights.delivery +
        reclameAquiScore * weights.reclameAqui +
        productRatingScore * weights.productRating
      ) * 100; // Converter para percentual
      
      return {
        ...budget,
        scores: {
          price: priceScore * 100,
          warranty: warrantyScore * 100,
          delivery: deliveryScore * 100,
          reclameAqui: reclameAquiScore * 100,
          productRating: productRatingScore * 100,
          total: totalScore
        }
      };
    });
  };

  if (!budgets || budgets.length < 2 || !bestBudget) {
    return null;
  }

  return (
    <>
      {/* Tabela Comparativa entre Orçamentos */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {t('budget.comparisonTable')}
        </h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('budget.provider')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('budget.date')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('budget.validity')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('budget.value')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('budget.deliveryTime')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('budget.warranty')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('budget.reputation')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('budget.score')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {scoredBudgets.map((budget) => (
                <tr key={budget.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${budget.id === bestBudget.id ? 'bg-green-50 dark:bg-green-900' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{budget.provider}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{budget.providerCNPJ}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{formatDate(budget.issueDate)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{budget.validUntil ? formatDate(budget.validUntil) : 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(budget.totalAmount)}</div>
                    {budget.shippingCost > 0 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        + {formatCurrency(budget.shippingCost)} (frete)
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {budget.deliveryTime ? `${budget.deliveryTime} dias` : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{budget.warranty || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium">{budget.reclameAquiScore ? budget.reclameAquiScore.toFixed(1) : '0.0'}</div>
                      <div className="ml-2 flex">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon 
                            key={i} 
                            className={`h-4 w-4 ${
                              i < Math.floor(budget.reclameAquiScore / 2) 
                                ? 'text-yellow-400' 
                                : i < budget.reclameAquiScore / 2 
                                  ? 'text-yellow-400' 
                                  : 'text-gray-300 dark:text-gray-600'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                      {Math.round(budget.scores.total)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Score de Oportunidade com IA */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {t('budget.opportunityScore')}
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6 h-full">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                  {t('budget.recommendedProvider')}
                </h4>
                <div className="bg-blue-500 text-white text-lg font-bold rounded-full h-12 w-12 flex items-center justify-center">
                  {Math.round(bestBudget.scores.total)}
                </div>
              </div>
              
              <div className="mb-4">
                <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {bestBudget.provider}
                </div>
                <div className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  {formatCurrency(bestBudget.totalAmount)}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t('budget.price')}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{Math.round(bestBudget.scores.price)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.round(bestBudget.scores.price)}%` }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t('budget.warranty')}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{Math.round(bestBudget.scores.warranty)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.round(bestBudget.scores.warranty)}%` }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t('budget.delivery')}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{Math.round(bestBudget.scores.delivery)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${Math.round(bestBudget.scores.delivery)}%` }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t('budget.reputation')}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{Math.round(bestBudget.scores.reclameAqui)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${Math.round(bestBudget.scores.reclameAqui)}%` }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            {/* Gráfico de barras com preços */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-5 w-5 text-blue-500 mr-2" />
                  {t('budget.priceComparison')}
                </div>
              </h4>
              <div className="h-64">
                <Bar 
                  data={{
                    labels: budgets.map(b => b.provider),
                    datasets: [
                      {
                        label: t('budget.price'),
                        data: budgets.map(b => b.totalAmount),
                        backgroundColor: 'rgba(59, 130, 246, 0.6)',
                        borderColor: 'rgb(59, 130, 246)',
                        borderWidth: 1
                      }
                    ]
                  }}
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
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
            
            {/* Radar chart com comparativo de critérios */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                <div className="flex items-center">
                  <DocumentTextIcon className="h-5 w-5 text-blue-500 mr-2" />
                  {t('budget.multidimensionalAnalysis')}
                </div>
              </h4>
              <div className="h-64">
                <Radar 
                  data={{
                    labels: [
                      t('budget.price'), 
                      t('budget.warranty'), 
                      t('budget.delivery'), 
                      t('budget.reputation'), 
                      t('budget.rating')
                    ],
                    datasets: scoredBudgets.map((budget, index) => ({
                      label: budget.provider,
                      data: [
                        budget.scores.price,
                        budget.scores.warranty,
                        budget.scores.delivery,
                        budget.scores.reclameAqui,
                        budget.scores.productRating
                      ],
                      backgroundColor: `rgba(${index * 50 + 100}, ${255 - index * 30}, ${index * 70 + 100}, 0.2)`,
                      borderColor: `rgb(${index * 50 + 100}, ${255 - index * 30}, ${index * 70 + 100})`,
                      borderWidth: 2,
                      pointBackgroundColor: `rgb(${index * 50 + 100}, ${255 - index * 30}, ${index * 70 + 100})`,
                      pointRadius: 4
                    }))
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                          display: false
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alertas de Risco e Recomendação Final */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {t('budget.riskAlerts')}
          </h3>
          
          {(() => {
            // Coletar todos os riscos de todos os orçamentos
            const allRisks = [];
            
            budgets.forEach(budget => {
              if (budget.riskFactors && budget.riskFactors.length > 0) {
                budget.riskFactors.forEach(risk => {
                  if (!allRisks.includes(`${budget.provider}: ${risk}`)) {
                    allRisks.push(`${budget.provider}: ${risk}`);
                  }
                });
              }
            });
            
            // Se não houver riscos, mostrar mensagem
            if (allRisks.length === 0) {
              return (
                <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4 flex items-start">
                  <ShieldCheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-green-800 dark:text-green-200">
                    {t('budget.noRisksIdentified')}
                  </p>
                </div>
              );
            }
            
            // Mostrar lista de riscos
            return (
              <div className="space-y-3">
                {allRisks.map((risk, index) => (
                  <div key={index} className="bg-red-50 dark:bg-red-900 rounded-lg p-3 flex items-start">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800 dark:text-red-200">{risk}</p>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
        
        {/* Recomendação Final */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {t('budget.finalRecommendation')}
          </h3>
          
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-xl font-bold mb-1">
                  {bestBudget.provider}
                </h4>
                <p className="text-lg">
                  {formatCurrency(bestBudget.totalAmount)}
                </p>
              </div>
              <div className="bg-white text-blue-600 text-xl font-bold rounded-full h-14 w-14 flex items-center justify-center">
                {Math.round(bestBudget.scores.total)}
              </div>
            </div>
            
            <p className="mb-6">
              {bestBudget.provider} {t('budget.offersBestCombination')} {budgets[0].title}.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                </svg>
                {t('budget.buyNow')}
              </button>
              <button className="bg-transparent border border-white text-white hover:bg-white hover:bg-opacity-10 px-4 py-2 rounded-lg font-medium flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                {t('budget.share')}
              </button>
            </div>
          </div>
          
          <div className="mt-4 bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              {t('budget.savingsTip')}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {budgets[0].category === 'tecnologia' 
                ? t('budget.savingsTipTech')
                : budgets[0].category === 'eletrodomestico'
                ? t('budget.savingsTipAppliance')
                : t('budget.savingsTipGeneral')}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default BudgetComparison;
