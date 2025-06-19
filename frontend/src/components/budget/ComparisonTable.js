import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  StarIcon, 
  TruckIcon, 
  ShieldCheckIcon, 
  CurrencyDollarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import StatusBadge from './StatusBadge';
import StatusSelector from './StatusSelector';

/**
 * Tabela de comparação entre orçamentos do mesmo grupo
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.budgets - Lista de orçamentos para comparar
 * @param {Function} props.onStatusChange - Função chamada quando o status é alterado
 * @param {Function} props.onGroupPrompt - Função chamada quando deve perguntar sobre agrupamento
 */
const ComparisonTable = ({ budgets, onStatusChange, onGroupPrompt }) => {
  const { t } = useTranslation();
  
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

  // Calcular scores e ordenar por pontuação total
  const scoredBudgets = calculateScores(budgets);
  const sortedBudgets = [...scoredBudgets].sort((a, b) => b.scores.total - a.scores.total);
  
  if (!sortedBudgets || sortedBudgets.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        {t('budget.noDataAvailable')}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {t('budget.provider')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {t('budget.price')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {t('budget.date')}
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
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {t('budget.status')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {sortedBudgets.map((budget, index) => (
            <tr 
              key={budget.id} 
              className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
                index === 0 ? 'bg-green-50 dark:bg-green-900/20' : ''
              }`}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {index === 0 && (
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-2">
                      <CheckCircleIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </span>
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {budget.provider}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {budget.providerCNPJ}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatCurrency(budget.totalAmount)}
                </div>
                {budget.shippingCost > 0 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    + {formatCurrency(budget.shippingCost)} ({t('budget.shipping')})
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">
                  {formatDate(budget.issueDate)}
                </div>
                {budget.validUntil && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {t('budget.validUntil')}: {formatDate(budget.validUntil)}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <TruckIcon className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-sm text-gray-900 dark:text-white">
                    {budget.deliveryTime ? `${budget.deliveryTime} ${t('budget.days')}` : t('budget.notSpecified')}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <ShieldCheckIcon className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-sm text-gray-900 dark:text-white">
                    {budget.warranty || t('budget.notSpecified')}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="text-sm font-medium text-gray-900 dark:text-white mr-1">
                    {budget.reclameAquiScore ? budget.reclameAquiScore.toFixed(1) : '-'}
                  </div>
                  <div className="flex">
                    {budget.reclameAquiScore && [...Array(5)].map((_, i) => (
                      <StarIcon 
                        key={i} 
                        className={`h-4 w-4 ${
                          i < Math.floor(budget.reclameAquiScore / 2) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300 dark:text-gray-600'
                        }`} 
                      />
                    ))}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    index === 0 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {Math.round(budget.scores.total)}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusSelector 
                  budgetId={budget.id}
                  currentStatus={budget.status}
                  onStatusChange={(newStatus) => onStatusChange(budget.id, newStatus)}
                  onGroupPrompt={() => onGroupPrompt(budget)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;
