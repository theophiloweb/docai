import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  DeviceTabletIcon, 
  HomeIcon, 
  TruckIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

/**
 * Componente para exibir estatísticas de orçamentos por categoria
 */
const BudgetCategoryStats = ({ budgets }) => {
  const { t } = useTranslation();

  // Categorias principais (máximo 5, com a última sendo "Outros")
  const mainCategories = ['tecnologia', 'eletrodomestico', 'moveis', 'veiculos', 'outros'];
  
  // Contar orçamentos por categoria
  const countByCategory = {};
  mainCategories.forEach(cat => {
    countByCategory[cat] = 0;
  });
  
  // Processar orçamentos
  budgets.forEach(budget => {
    const category = budget.category ? budget.category.toLowerCase() : 'outros';
    if (mainCategories.includes(category)) {
      countByCategory[category]++;
    } else {
      countByCategory['outros']++;
    }
  });
  
  // Calcular total para percentuais
  const total = Object.values(countByCategory).reduce((sum, count) => sum + count, 0);
  
  // Definir ícones e cores para cada categoria
  const categoryConfig = {
    tecnologia: {
      icon: <DeviceTabletIcon className="h-8 w-8 text-blue-500" />,
      color: 'bg-blue-100 dark:bg-blue-900',
      textColor: 'text-blue-800 dark:text-blue-200'
    },
    eletrodomestico: {
      icon: <HomeIcon className="h-8 w-8 text-green-500" />,
      color: 'bg-green-100 dark:bg-green-900',
      textColor: 'text-green-800 dark:text-green-200'
    },
    moveis: {
      icon: <HomeIcon className="h-8 w-8 text-yellow-500" />,
      color: 'bg-yellow-100 dark:bg-yellow-900',
      textColor: 'text-yellow-800 dark:text-yellow-200'
    },
    veiculos: {
      icon: <TruckIcon className="h-8 w-8 text-red-500" />,
      color: 'bg-red-100 dark:bg-red-900',
      textColor: 'text-red-800 dark:text-red-200'
    },
    outros: {
      icon: <DocumentTextIcon className="h-8 w-8 text-purple-500" />,
      color: 'bg-purple-100 dark:bg-purple-900',
      textColor: 'text-purple-800 dark:text-purple-200'
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {t('budget.categoryStats')}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {mainCategories.map((category) => (
          <div 
            key={category}
            className={`${categoryConfig[category].color} rounded-lg p-4 flex flex-col items-center justify-center`}
          >
            <div className="mb-2">
              {categoryConfig[category].icon}
            </div>
            <h4 className={`text-lg font-medium ${categoryConfig[category].textColor} mb-1`}>
              {t(`budget.categories.${category}`)}
            </h4>
            <div className="flex items-end">
              <span className={`text-2xl font-bold ${categoryConfig[category].textColor}`}>
                {countByCategory[category]}
              </span>
              <span className={`ml-1 text-sm ${categoryConfig[category].textColor}`}>
                ({total > 0 ? Math.round((countByCategory[category] / total) * 100) : 0}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetCategoryStats;
