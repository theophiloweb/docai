import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon, 
  ArchiveIcon 
} from '@heroicons/react/24/solid';

/**
 * Componente para exibir o status de um orçamento como um badge
 * @param {Object} props - Propriedades do componente
 * @param {string} props.status - Status do orçamento (aprovado, pendente, fechado, recusado)
 * @param {boolean} props.small - Se true, exibe uma versão menor do badge
 */
const StatusBadge = ({ status, small = false }) => {
  const { t } = useTranslation();
  
  // Configurações para cada tipo de status
  const statusConfig = {
    aprovado: {
      icon: CheckCircleIcon,
      label: t('budget.status.approved'),
      color: 'bg-green-100 text-green-800',
      iconColor: 'text-green-500'
    },
    pendente: {
      icon: ClockIcon,
      label: t('budget.status.pending'),
      color: 'bg-yellow-100 text-yellow-800',
      iconColor: 'text-yellow-500'
    },
    fechado: {
      icon: ArchiveIcon,
      label: t('budget.status.closed'),
      color: 'bg-blue-100 text-blue-800',
      iconColor: 'text-blue-500'
    },
    recusado: {
      icon: XCircleIcon,
      label: t('budget.status.rejected'),
      color: 'bg-red-100 text-red-800',
      iconColor: 'text-red-500'
    },
    expirado: {
      icon: XCircleIcon,
      label: t('budget.status.expired'),
      color: 'bg-gray-100 text-gray-800',
      iconColor: 'text-gray-500'
    }
  };
  
  // Usar configuração padrão se o status não for reconhecido
  const config = statusConfig[status] || {
    icon: ClockIcon,
    label: status || t('common.unknown'),
    color: 'bg-gray-100 text-gray-800',
    iconColor: 'text-gray-500'
  };
  
  const Icon = config.icon;
  
  // Versão pequena do badge (apenas ícone)
  if (small) {
    return (
      <span className={`inline-flex items-center rounded-full p-1 ${config.color}`}>
        <Icon className={`h-3 w-3 ${config.iconColor}`} />
      </span>
    );
  }
  
  // Versão normal do badge (ícone + texto)
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 ${config.color}`}>
      <Icon className={`-ml-0.5 mr-1.5 h-3 w-3 ${config.iconColor}`} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
