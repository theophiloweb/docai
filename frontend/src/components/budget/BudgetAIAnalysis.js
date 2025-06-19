import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LightBulbIcon, ExclamationCircleIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import { toast } from 'react-toastify';

/**
 * Componente para exibir análise de IA para orçamentos
 */
const BudgetAIAnalysis = ({ budgets }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (budgets && budgets.length >= 2) {
      generateAnalysis();
    }
  }, [budgets]);

  // Gerar análise de IA
  const generateAnalysis = async () => {
    if (!budgets || budgets.length < 2) {
      setError('É necessário pelo menos 2 orçamentos para gerar uma análise.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const budgetIds = budgets.map(budget => budget.id);
      
      const response = await api.post('/ai/budget/insights', {
        budgetIds
      });

      if (response.data && response.data.success) {
        setAnalysis(response.data.data);
      } else {
        setError('Não foi possível gerar a análise. Tente novamente mais tarde.');
      }
    } catch (error) {
      console.error('Erro ao gerar análise de IA:', error);
      setError('Ocorreu um erro ao gerar a análise. Tente novamente mais tarde.');
      toast.error(t('budget.errors.aiAnalysisFailed'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
          <span className="text-gray-700 dark:text-gray-300">{t('budget.generatingAnalysis')}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
        <div className="flex items-start">
          <ExclamationCircleIcon className="h-6 w-6 text-red-500 mr-2 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t('budget.aiAnalysisError')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <LightBulbIcon className="h-6 w-6 text-yellow-500 mr-2" />
        {t('budget.aiAnalysisTitle')}
      </h3>

      <div className="space-y-6">
        {analysis.map((insight, index) => (
          <div key={index} className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2 flex items-center">
              {insight.title === 'Visão Geral' && <ArrowTrendingUpIcon className="h-5 w-5 text-blue-500 mr-2" />}
              {insight.title === 'Recomendações' && <LightBulbIcon className="h-5 w-5 text-yellow-500 mr-2" />}
              {insight.title === 'Análise Comparativa' && <ArrowTrendingUpIcon className="h-5 w-5 text-purple-500 mr-2" />}
              {insight.title === 'Fatores de Risco' && <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2" />}
              {insight.title === 'Estratégias de Economia' && <ArrowTrendingUpIcon className="h-5 w-5 text-green-500 mr-2" />}
              {insight.title}
            </h4>
            <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {insight.description}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 italic">
        {t('budget.aiDisclaimer')}
      </div>
    </div>
  );
};

export default BudgetAIAnalysis;
