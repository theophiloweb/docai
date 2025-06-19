import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ChevronDownIcon, 
  ChevronUpIcon, 
  CurrencyDollarIcon,
  CalendarIcon,
  ShoppingBagIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import api from '../../services/api';

/**
 * Componente para exibir lista de grupos de orçamentos com detalhes expansíveis
 */
const BudgetGroupList = ({ budgetGroups, onUpdate }) => {
  const { t } = useTranslation();
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [loading, setLoading] = useState(false);

  // Formatar valor monetário
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  // Formatar data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Alternar expansão do grupo
  const toggleExpand = (groupTitle) => {
    if (expandedGroup === groupTitle) {
      setExpandedGroup(null);
    } else {
      setExpandedGroup(groupTitle);
    }
  };

  // Atualizar status de um orçamento
  const updateBudgetStatus = async (budgetId, status) => {
    try {
      setLoading(true);
      
      await api.put(`/budget/${budgetId}/status`, { status });
      
      toast.success(t('budget.statusUpdateSuccess'));
      onUpdate();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error(t('budget.errors.statusUpdateFailed'));
    } finally {
      setLoading(false);
    }
  };

  // Encontrar o melhor orçamento do grupo (menor preço)
  const findBestBudget = (budgets) => {
    if (!budgets || budgets.length === 0) return null;
    return budgets.reduce((best, current) => 
      (current.totalAmount < best.totalAmount) ? current : best
    , budgets[0]);
  };

  // Encontrar o orçamento com melhor reputação
  const findBestReputationBudget = (budgets) => {
    if (!budgets || budgets.length === 0) return null;
    return budgets.reduce((best, current) => 
      ((current.reclameAquiScore || 0) > (best.reclameAquiScore || 0)) ? current : best
    , budgets[0]);
  };

  // Calcular preço médio do grupo
  const calculateAveragePrice = (budgets) => {
    if (!budgets || budgets.length === 0) return 0;
    const sum = budgets.reduce((total, budget) => total + parseFloat(budget.totalAmount || 0), 0);
    return sum / budgets.length;
  };

  // Calcular diferença percentual entre maior e menor preço
  const calculatePriceDifference = (budgets) => {
    if (!budgets || budgets.length < 2) return 0;
    
    const prices = budgets.map(b => parseFloat(b.totalAmount || 0));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    return ((maxPrice - minPrice) / minPrice) * 100;
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {t('budget.allBudgetGroups')}
      </h3>
      
      {Object.keys(budgetGroups).length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {t('budget.noBudgetGroups')}
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(budgetGroups).map(([groupTitle, budgets]) => {
            const bestBudget = findBestBudget(budgets);
            const bestReputationBudget = findBestReputationBudget(budgets);
            const averagePrice = calculateAveragePrice(budgets);
            const priceDifference = calculatePriceDifference(budgets);
            
            return (
              <div key={groupTitle} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                {/* Cabeçalho do grupo (sempre visível) */}
                <div 
                  className="bg-gray-50 dark:bg-gray-700 p-4 flex items-center justify-between cursor-pointer"
                  onClick={() => toggleExpand(groupTitle)}
                >
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      {groupTitle}
                    </h4>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <ShoppingBagIcon className="h-4 w-4 mr-1" />
                      <span>{budgets.length} {t('budget.quotes')}</span>
                      <span className="mx-2">•</span>
                      <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                      <span>{formatCurrency(averagePrice)} {t('budget.avgPrice')}</span>
                      <span className="mx-2">•</span>
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>{formatDate(budgets[0].issueDate)}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {expandedGroup === groupTitle ? (
                      <ChevronUpIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    )}
                  </div>
                </div>
                
                {/* Conteúdo expandido */}
                {expandedGroup === groupTitle && (
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Coluna 1: Lista de orçamentos */}
                      <div className="md:col-span-2">
                        <h5 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                          {t('budget.quotesInGroup')}
                        </h5>
                        <div className="space-y-3">
                          {budgets.map((budget) => (
                            <div 
                              key={budget.id} 
                              className={`border ${budget === bestBudget ? 'border-green-500 dark:border-green-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-3`}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-medium text-gray-900 dark:text-white">
                                    {budget.provider}
                                    {budget === bestBudget && (
                                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                        {t('budget.bestPrice')}
                                      </span>
                                    )}
                                    {budget === bestReputationBudget && budget !== bestBudget && (
                                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                        {t('budget.bestReputation')}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {formatDate(budget.issueDate)}
                                    {budget.validUntil && ` - ${t('budget.validUntil')} ${formatDate(budget.validUntil)}`}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold text-gray-900 dark:text-white">
                                    {formatCurrency(budget.totalAmount)}
                                  </div>
                                  {budget.shippingCost > 0 && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                      + {formatCurrency(budget.shippingCost)} ({t('budget.shipping')})
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="mt-2 flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="text-sm text-gray-600 dark:text-gray-300 mr-4">
                                    <span className="font-medium">{t('budget.deliveryTime')}:</span> {budget.deliveryTime ? `${budget.deliveryTime} ${t('budget.days')}` : t('budget.notSpecified')}
                                  </div>
                                  <div className="text-sm text-gray-600 dark:text-gray-300">
                                    <span className="font-medium">{t('budget.warranty')}:</span> {budget.warranty || t('budget.notSpecified')}
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  {budget.reclameAquiScore && (
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                      <span className="font-medium mr-1">{t('budget.reputation')}:</span>
                                      <span className="mr-1">{budget.reclameAquiScore.toFixed(1)}</span>
                                      <div className="flex">
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
                                  )}
                                </div>
                              </div>
                              
                              <div className="mt-3 flex justify-between items-center">
                                <div>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                    ${budget.status === 'aprovado' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                                      budget.status === 'recusado' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 
                                      budget.status === 'fechado' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 
                                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}
                                  >
                                    {budget.status === 'aprovado' ? t('budget.status.approved') : 
                                     budget.status === 'recusado' ? t('budget.status.rejected') : 
                                     budget.status === 'fechado' ? t('budget.status.closed') : 
                                     t('budget.status.pending')}
                                  </span>
                                </div>
                                <div>
                                  <select
                                    className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    value={budget.status}
                                    onChange={(e) => updateBudgetStatus(budget.id, e.target.value)}
                                    disabled={loading}
                                  >
                                    <option value="pendente">{t('budget.status.pending')}</option>
                                    <option value="aprovado">{t('budget.status.approved')}</option>
                                    <option value="recusado">{t('budget.status.rejected')}</option>
                                    <option value="fechado">{t('budget.status.closed')}</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Coluna 2: Resumo da IA */}
                      <div className="md:col-span-1">
                        <h5 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                          {t('budget.aiSummary')}
                        </h5>
                        <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {t('budget.aiSummaryText', { 
                              count: budgets.length, 
                              product: groupTitle,
                              priceDiff: formatCurrency(Math.max(...budgets.map(b => b.totalAmount)) - Math.min(...budgets.map(b => b.totalAmount))),
                              percentage: Math.round(priceDifference)
                            })}
                          </p>
                          
                          <div className="mt-4">
                            <h6 className="font-medium text-gray-900 dark:text-white text-sm">
                              {t('budget.recommendation')}:
                            </h6>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                              <span className="font-medium">{bestBudget.provider}</span> - {formatCurrency(bestBudget.totalAmount)}
                              <br />
                              {bestBudget === bestReputationBudget ? 
                                t('budget.bestPriceAndReputation') : 
                                t('budget.lowestPriceConsiderReputation', { provider: bestReputationBudget.provider })}
                            </p>
                          </div>
                          
                          {budgets.some(b => b.riskFactors && b.riskFactors.length > 0) && (
                            <div className="mt-4">
                              <h6 className="font-medium text-gray-900 dark:text-white text-sm">
                                {t('budget.riskFactors')}:
                              </h6>
                              <ul className="text-sm text-gray-700 dark:text-gray-300 mt-1 list-disc pl-5">
                                {budgets.flatMap(budget => 
                                  (budget.riskFactors || []).map((risk, index) => (
                                    <li key={`${budget.id}-risk-${index}`}>
                                      <span className="font-medium">{budget.provider}:</span> {risk}
                                    </li>
                                  ))
                                )}
                              </ul>
                            </div>
                          )}
                          
                          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 italic">
                            {t('budget.aiDisclaimer')}
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <button 
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                            onClick={() => {
                              // Aqui você pode implementar a navegação para uma página de detalhes
                              // ou abrir um modal com análise completa da IA
                              toast.info(t('budget.fullAnalysisComingSoon'));
                            }}
                          >
                            {t('budget.viewFullAnalysis')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BudgetGroupList;
