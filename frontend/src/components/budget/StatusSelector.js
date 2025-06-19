import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircleIcon, XCircleIcon, ClockIcon, ArchiveIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import { toast } from 'react-toastify';

/**
 * Componente para selecionar o status de um orçamento
 * @param {Object} props - Propriedades do componente
 * @param {string} props.budgetId - ID do orçamento
 * @param {string} props.currentStatus - Status atual do orçamento
 * @param {Function} props.onStatusChange - Função chamada quando o status é alterado
 * @param {Function} props.onGroupPrompt - Função chamada quando deve perguntar sobre agrupamento
 */
const StatusSelector = ({ budgetId, currentStatus, onStatusChange, onGroupPrompt }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  
  // Definir opções de status
  const statusOptions = [
    { 
      value: 'aprovado', 
      label: t('budget.status.approved'), 
      icon: CheckCircleIcon,
      color: 'text-green-600 bg-green-100 hover:bg-green-200',
      activeColor: 'bg-green-600 text-white'
    },
    { 
      value: 'pendente', 
      label: t('budget.status.pending'), 
      icon: ClockIcon,
      color: 'text-yellow-600 bg-yellow-100 hover:bg-yellow-200',
      activeColor: 'bg-yellow-600 text-white'
    },
    { 
      value: 'fechado', 
      label: t('budget.status.closed'), 
      icon: ArchiveIcon,
      color: 'text-blue-600 bg-blue-100 hover:bg-blue-200',
      activeColor: 'bg-blue-600 text-white'
    },
    { 
      value: 'recusado', 
      label: t('budget.status.rejected'), 
      icon: XCircleIcon,
      color: 'text-red-600 bg-red-100 hover:bg-red-200',
      activeColor: 'bg-red-600 text-white'
    }
  ];

  /**
   * Atualiza o status do orçamento
   * @param {string} newStatus - Novo status
   */
  const handleStatusChange = async (newStatus) => {
    // Não fazer nada se o status não mudou
    if (newStatus === currentStatus) return;
    
    setLoading(true);
    
    try {
      const response = await api.put(`/budget/records/${budgetId}/status`, { 
        status: newStatus 
      });
      
      if (response.data && response.data.success) {
        toast.success(t('budget.statusUpdated'));
        
        // Chamar callback se fornecido
        if (onStatusChange) {
          onStatusChange(newStatus);
        }
        
        // Se o status não for "recusado" ou "fechado", perguntar sobre agrupamento
        if (newStatus !== 'recusado' && newStatus !== 'fechado' && onGroupPrompt) {
          onGroupPrompt();
        }
      } else {
        toast.error(t('budget.errors.statusUpdateFailed'));
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error(t('budget.errors.statusUpdateFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {statusOptions.map((option) => {
        const Icon = option.icon;
        const isActive = currentStatus === option.value;
        
        return (
          <button
            key={option.value}
            onClick={() => handleStatusChange(option.value)}
            disabled={loading}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              isActive ? option.activeColor : option.color
            }`}
          >
            <Icon className="h-4 w-4 mr-1" />
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default StatusSelector;
