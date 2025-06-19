import React from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import { toast } from 'react-toastify';

/**
 * Componente para selecionar o status de um orçamento
 */
const BudgetStatusSelector = ({ budgetId, currentStatus, onStatusChange }) => {
  const { t } = useTranslation();
  
  const statusOptions = [
    { value: 'pendente', label: t('budget.status.pending'), color: 'bg-yellow-100 text-yellow-800' },
    { value: 'aprovado', label: t('budget.status.approved'), color: 'bg-green-100 text-green-800' },
    { value: 'fechado', label: t('budget.status.closed'), color: 'bg-blue-100 text-blue-800' },
    { value: 'recusado', label: t('budget.status.rejected'), color: 'bg-red-100 text-red-800' }
  ];

  const handleStatusChange = async (newStatus) => {
    try {
      // Não fazer nada se o status não mudou
      if (newStatus === currentStatus) return;
      
      const response = await api.put(`/budget/records/${budgetId}/status`, { 
        status: newStatus 
      });
      
      if (response.data && response.data.success) {
        toast.success(t('budget.statusUpdated'));
        
        // Chamar callback se fornecido
        if (onStatusChange) {
          onStatusChange(newStatus);
        }
      } else {
        toast.error(t('budget.errors.statusUpdateFailed'));
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error(t('budget.errors.statusUpdateFailed'));
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {statusOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => handleStatusChange(option.value)}
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            currentStatus === option.value
              ? option.color
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default BudgetStatusSelector;
