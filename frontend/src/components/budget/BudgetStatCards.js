import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

/**
 * Componente para exibir cards estatísticos de orçamentos
 */
const BudgetStatCards = ({ budgets }) => {
  const { t } = useTranslation();

  // Calcular estatísticas
  const totalBudgets = budgets.length;
  const pendingBudgets = budgets.filter(b => b.status === 'pendente').length;
  const approvedBudgets = budgets.filter(b => b.status === 'aprovado').length;
  const rejectedBudgets = budgets.filter(b => b.status === 'recusado').length;
  
  // Calcular valor total
  const totalAmount = budgets.reduce((sum, budget) => {
    return sum + (parseFloat(budget.totalAmount) || 0);
  }, 0);
  
  // Formatar valor monetário
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  // Configuração dos cards
  const cards = [
    {
      title: t('budget.totalBudgets'),
      value: totalBudgets,
      icon: <DocumentTextIcon className="h-8 w-8 text-blue-500" />,
      color: 'bg-blue-100 dark:bg-blue-900',
      textColor: 'text-blue-800 dark:text-blue-200'
    },
    {
      title: t('budget.totalAmount'),
      value: formatCurrency(totalAmount),
      icon: <CurrencyDollarIcon className="h-8 w-8 text-green-500" />,
      color: 'bg-green-100 dark:bg-green-900',
      textColor: 'text-green-800 dark:text-green-200'
    },
    {
      title: t('budget.pendingBudgets'),
      value: pendingBudgets,
      icon: <ClockIcon className="h-8 w-8 text-yellow-500" />,
      color: 'bg-yellow-100 dark:bg-yellow-900',
      textColor: 'text-yellow-800 dark:text-yellow-200'
    },
    {
      title: t('budget.approvedBudgets'),
      value: approvedBudgets,
      icon: <CheckCircleIcon className="h-8 w-8 text-emerald-500" />,
      color: 'bg-emerald-100 dark:bg-emerald-900',
      textColor: 'text-emerald-800 dark:text-emerald-200'
    },
    {
      title: t('budget.rejectedBudgets'),
      value: rejectedBudgets,
      icon: <XCircleIcon className="h-8 w-8 text-red-500" />,
      color: 'bg-red-100 dark:bg-red-900',
      textColor: 'text-red-800 dark:text-red-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.color} rounded-lg p-4 shadow-sm`}
        >
          <div className="flex items-center">
            <div className="mr-4">
              {card.icon}
            </div>
            <div>
              <h3 className={`text-sm font-medium ${card.textColor}`}>
                {card.title}
              </h3>
              <p className={`text-2xl font-bold ${card.textColor}`}>
                {card.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BudgetStatCards;
