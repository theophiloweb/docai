import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  StarIcon, 
  TruckIcon, 
  ShieldCheckIcon, 
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline';

/**
 * Componente para exibir comparação entre orçamentos
 */
const BudgetComparisonCard = ({ budgets }) => {
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
  const bestBudget = sortedBudgets[0];

  if (!bestBudget) return null;

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {t('budget.comparison.title')}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('budget.comparison.recommended')}
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
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('budget.comparison.price')}</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{Math.round(bestBudget.scores.price)}%</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ShieldCheckIcon className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('budget.comparison.warranty')}</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{Math.round(bestBudget.scores.warranty)}%</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TruckIcon className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('budget.comparison.delivery')}</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{Math.round(bestBudget.scores.delivery)}%</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <StarIcon className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('budget.comparison.reputation')}</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{Math.round(bestBudget.scores.reclameAqui)}%</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">
            {t('budget.comparison.aiAnalysis')}
          </h4>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {budgets.length >= 2 ? (
                <>
                  {t('budget.comparison.analysisIntro', { count: budgets.length, product: budgets[0].title })}
                  <br/><br/>
                  {t('budget.comparison.priceDifference', { 
                    difference: formatCurrency(Math.max(...budgets.map(b => b.totalAmount)) - Math.min(...budgets.map(b => b.totalAmount))),
                    percentage: Math.round(((Math.max(...budgets.map(b => b.totalAmount)) - Math.min(...budgets.map(b => b.totalAmount))) / Math.min(...budgets.map(b => b.totalAmount)) * 100))
                  })}
                  <br/><br/>
                  <strong>{t('budget.comparison.recommendation')}</strong> {t('budget.comparison.recommendationText', { provider: bestBudget.provider })}
                </>
              ) : (
                t('budget.comparison.notEnoughData')
              )}
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
            <h5 className="font-medium mb-2">{t('budget.comparison.llama.title')}</h5>
            <p className="text-sm">
              {t('budget.comparison.llama.analysis', { provider: bestBudget.provider, price: formatCurrency(bestBudget.totalAmount) })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetComparisonCard;
