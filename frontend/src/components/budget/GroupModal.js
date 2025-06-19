import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { XMarkIcon, FolderPlusIcon, FolderIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import { toast } from 'react-toastify';

/**
 * Modal para agrupar orçamentos relacionados
 * @param {Object} props - Propriedades do componente
 * @param {boolean} props.isOpen - Se o modal está aberto
 * @param {Function} props.onClose - Função chamada quando o modal é fechado
 * @param {Object} props.budget - Orçamento a ser agrupado
 * @param {Object} props.existingGroups - Grupos de orçamentos existentes
 */
const GroupModal = ({ isOpen, onClose, budget, existingGroups }) => {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState('new');
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(false);
  const [availableGroups, setAvailableGroups] = useState([]);

  // Inicializar o nome do grupo com o título do orçamento
  useEffect(() => {
    if (budget && budget.title) {
      setGroupName(budget.title);
    }
  }, [budget]);

  // Filtrar grupos ativos quando os grupos existentes mudam
  useEffect(() => {
    if (existingGroups) {
      // Filtrar grupos ativos (não recusados ou fechados)
      const activeGroups = Object.entries(existingGroups)
        .filter(([_, budgets]) => 
          budgets.some(b => b.status !== 'recusado' && b.status !== 'fechado')
        )
        .map(([title, budgets]) => ({
          title,
          groupId: budgets[0].groupId || title.replace(/\\s+/g, '-').toLowerCase(),
          count: budgets.length
        }));
      
      setAvailableGroups(activeGroups);
      
      // Se não houver grupos disponíveis, forçar a opção "novo grupo"
      if (activeGroups.length === 0) {
        setSelectedOption('new');
      }
    }
  }, [existingGroups]);

  // Fechar o modal e resetar o estado
  const handleClose = () => {
    setSelectedOption('new');
    setSelectedGroupId('');
    setGroupName('');
    onClose(false);
  };

  // Enviar o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (selectedOption === 'new') {
        // Criar novo grupo com este orçamento
        const newGroupId = groupName.replace(/\\s+/g, '-').toLowerCase() + '-' + Date.now();
        
        const response = await api.put(`/budget/group`, {
          budgetIds: [budget.id],
          groupId: newGroupId,
          groupName: groupName
        });
        
        if (response.data && response.data.success) {
          toast.success(t('budget.newGroupCreated'));
          onClose(true); // Fechar com flag de sucesso
        } else {
          toast.error(t('budget.errors.groupUpdateFailed'));
        }
      } else {
        // Adicionar ao grupo existente
        const response = await api.put(`/budget/group/add`, {
          budgetId: budget.id,
          groupId: selectedGroupId
        });
        
        if (response.data && response.data.success) {
          toast.success(t('budget.addedToGroup'));
          onClose(true); // Fechar com flag de sucesso
        } else {
          toast.error(t('budget.errors.groupUpdateFailed'));
        }
      }
    } catch (error) {
      console.error('Erro ao agrupar orçamento:', error);
      toast.error(t('budget.errors.groupUpdateFailed'));
    } finally {
      setLoading(false);
    }
  };

  // Se o modal não estiver aberto, não renderizar nada
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        {/* Cabeçalho do modal */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {t('budget.groupBudget')}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        {/* Descrição */}
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          {t('budget.groupDescription')}
        </p>
        
        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Opções de agrupamento */}
            <div className="space-y-3">
              {/* Opção: Novo grupo */}
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                <input
                  type="radio"
                  name="groupOption"
                  value="new"
                  checked={selectedOption === 'new'}
                  onChange={() => setSelectedOption('new')}
                  className="h-4 w-4 text-blue-600"
                />
                <div className="ml-3 flex items-center">
                  <FolderPlusIcon className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('budget.createNewGroup')}
                  </span>
                </div>
              </label>
              
              {/* Opção: Grupo existente (se houver) */}
              {availableGroups.length > 0 && (
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <input
                    type="radio"
                    name="groupOption"
                    value="existing"
                    checked={selectedOption === 'existing'}
                    onChange={() => setSelectedOption('existing')}
                    className="h-4 w-4 text-blue-600"
                  />
                  <div className="ml-3 flex items-center">
                    <FolderIcon className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('budget.addToExistingGroup')}
                    </span>
                  </div>
                </label>
              )}
            </div>
            
            {/* Campo para novo grupo */}
            {selectedOption === 'new' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('budget.groupName')}
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t('budget.enterGroupName')}
                  required
                />
              </div>
            )}
            
            {/* Seletor de grupo existente */}
            {selectedOption === 'existing' && availableGroups.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('budget.selectGroup')}
                </label>
                <select
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
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
          </div>
          
          {/* Botões de ação */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              disabled={loading}
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading || (selectedOption === 'existing' && !selectedGroupId) || (selectedOption === 'new' && !groupName)}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('common.processing')}
                </span>
              ) : (
                t('common.confirm')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupModal;
