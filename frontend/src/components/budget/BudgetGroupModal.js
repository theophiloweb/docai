import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import { toast } from 'react-toastify';

/**
 * Modal para agrupar orçamentos relacionados
 */
const BudgetGroupModal = ({ isOpen, onClose, budget, existingGroups }) => {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState('new');
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [loading, setLoading] = useState(false);
  const [availableGroups, setAvailableGroups] = useState([]);

  useEffect(() => {
    // Filtrar grupos ativos (não recusados ou fechados)
    if (existingGroups) {
      const activeGroups = Object.entries(existingGroups)
        .filter(([_, budgets]) => 
          budgets.some(b => b.status !== 'recusado' && b.status !== 'fechado')
        )
        .map(([title, budgets]) => ({
          title,
          groupId: budgets[0].groupId || title.replace(/\s+/g, '-').toLowerCase(),
          count: budgets.length
        }));
      
      setAvailableGroups(activeGroups);
    }
  }, [existingGroups]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (selectedOption === 'new') {
        // Criar novo grupo com este orçamento
        const newGroupId = budget.title.replace(/\s+/g, '-').toLowerCase() + '-' + Date.now();
        
        await api.put(`/budget/records/${budget.id}/group`, {
          groupId: newGroupId
        });
        
        toast.success(t('budget.newGroupCreated'));
      } else {
        // Adicionar ao grupo existente
        await api.put(`/budget/records/${budget.id}/group`, {
          groupId: selectedGroupId
        });
        
        toast.success(t('budget.addedToGroup'));
      }
      
      onClose(true); // Fechar com flag de sucesso
    } catch (error) {
      console.error('Erro ao agrupar orçamento:', error);
      toast.error(t('budget.errors.groupUpdateFailed'));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {t('budget.groupBudget')}
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {t('budget.groupDescription')}
            </p>
            
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="groupOption"
                  value="new"
                  checked={selectedOption === 'new'}
                  onChange={() => setSelectedOption('new')}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {t('budget.createNewGroup')}
                </span>
              </label>
              
              {availableGroups.length > 0 && (
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="groupOption"
                    value="existing"
                    checked={selectedOption === 'existing'}
                    onChange={() => setSelectedOption('existing')}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {t('budget.addToExistingGroup')}
                  </span>
                </label>
              )}
            </div>
          </div>
          
          {selectedOption === 'existing' && availableGroups.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('budget.selectGroup')}
              </label>
              <select
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={selectedOption === 'existing'}
              >
                <option value="">{t('common.select')}</option>
                {availableGroups.map((group) => (
                  <option key={group.groupId} value={group.groupId}>
                    {group.title} ({group.count} {t('budget.items')})
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              disabled={loading}
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading || (selectedOption === 'existing' && !selectedGroupId)}
            >
              {loading ? t('common.processing') : t('common.confirm')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetGroupModal;
