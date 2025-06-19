import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import api from '../../services/api';

/**
 * Componente para gerenciar grupos de orçamentos
 */
const BudgetGroupManager = ({ budgets, selectedBudgets, onGroupUpdate }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [existingGroups, setExistingGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [createNewGroup, setCreateNewGroup] = useState(true);

  // Carregar grupos existentes
  const loadExistingGroups = async () => {
    try {
      const response = await api.get('/budget/groups');
      if (response.data && response.data.success && response.data.data.groups) {
        const groups = Object.keys(response.data.data.groups);
        setExistingGroups(groups);
        if (groups.length > 0) {
          setSelectedGroup(groups[0]);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar grupos existentes:', error);
    }
  };

  // Abrir modal de grupo
  const openGroupModal = async () => {
    await loadExistingGroups();
    setShowGroupModal(true);
  };

  // Fechar modal de grupo
  const closeGroupModal = () => {
    setShowGroupModal(false);
    setGroupName('');
    setSelectedGroup('');
    setCreateNewGroup(true);
  };

  // Criar ou atualizar grupo
  const handleCreateOrUpdateGroup = async () => {
    if (selectedBudgets.length < 2) {
      toast.error(t('budget.errors.minTwoBudgets'));
      return;
    }

    try {
      setLoading(true);

      let groupId = null;
      
      if (!createNewGroup && selectedGroup) {
        // Adicionar a um grupo existente
        const groupResponse = await api.post('/budget/group/add', {
          budgetIds: selectedBudgets,
          groupId: selectedGroup
        });
        
        if (groupResponse.data && groupResponse.data.success) {
          toast.success(t('budget.groupAddSuccess'));
          onGroupUpdate();
          closeGroupModal();
        }
      } else {
        // Criar novo grupo
        if (!groupName.trim()) {
          toast.error(t('budget.errors.groupNameRequired'));
          setLoading(false);
          return;
        }

        const groupResponse = await api.post('/budget/group/create', {
          budgetIds: selectedBudgets,
          groupName: groupName.trim()
        });
        
        if (groupResponse.data && groupResponse.data.success) {
          toast.success(t('budget.groupCreateSuccess'));
          onGroupUpdate();
          closeGroupModal();
        }
      }
    } catch (error) {
      console.error('Erro ao criar/atualizar grupo:', error);
      toast.error(t('budget.errors.groupUpdateFailed'));
    } finally {
      setLoading(false);
    }
  };

  // Atualizar status de orçamentos selecionados
  const updateBudgetsStatus = async (status) => {
    if (selectedBudgets.length === 0) {
      toast.error(t('budget.errors.noBudgetsSelected'));
      return;
    }

    try {
      setLoading(true);
      
      // Atualizar status de cada orçamento selecionado
      const updatePromises = selectedBudgets.map(budgetId => 
        api.put(`/budget/${budgetId}/status`, { status })
      );
      
      await Promise.all(updatePromises);
      
      toast.success(t('budget.statusUpdateSuccess'));
      
      // Se o status não for "recusado" ou "fechado", perguntar se deseja agrupar
      if (status !== 'recusado' && status !== 'fechado' && selectedBudgets.length >= 2) {
        // Verificar se os orçamentos são do mesmo produto
        const selectedBudgetObjects = budgets.filter(b => selectedBudgets.includes(b.id));
        const titles = [...new Set(selectedBudgetObjects.map(b => b.title))];
        
        if (titles.length === 1) {
          // Perguntar se deseja agrupar
          const shouldGroup = window.confirm(t('budget.confirmGrouping'));
          if (shouldGroup) {
            openGroupModal();
          }
        }
      }
      
      onGroupUpdate();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error(t('budget.errors.statusUpdateFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 font-inter">
          {t('budget.groupManagement')}
        </h3>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateBudgetsStatus('aprovado')}
            disabled={loading || selectedBudgets.length === 0}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm font-medium disabled:opacity-50"
          >
            {t('budget.status.approved')}
          </button>
          
          <button
            onClick={() => updateBudgetsStatus('pendente')}
            disabled={loading || selectedBudgets.length === 0}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm font-medium disabled:opacity-50"
          >
            {t('budget.status.pending')}
          </button>
          
          <button
            onClick={() => updateBudgetsStatus('recusado')}
            disabled={loading || selectedBudgets.length === 0}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium disabled:opacity-50"
          >
            {t('budget.status.rejected')}
          </button>
          
          <button
            onClick={() => updateBudgetsStatus('fechado')}
            disabled={loading || selectedBudgets.length === 0}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium disabled:opacity-50"
          >
            {t('budget.status.closed')}
          </button>
          
          <button
            onClick={openGroupModal}
            disabled={loading || selectedBudgets.length < 2}
            className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-md text-sm font-medium disabled:opacity-50"
          >
            {t('budget.createGroup')}
          </button>
        </div>
        
        {selectedBudgets.length > 0 && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {selectedBudgets.length} {t('budget.itemsSelected')}
          </p>
        )}
      </div>

      {/* Modal para criar/atualizar grupo */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {t('budget.groupBudgets')}
            </h3>
            
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  id="create-new-group"
                  name="group-option"
                  checked={createNewGroup}
                  onChange={() => setCreateNewGroup(true)}
                  className="mr-2"
                />
                <label htmlFor="create-new-group" className="text-gray-700 dark:text-gray-300">
                  {t('budget.createNewGroup')}
                </label>
              </div>
              
              {createNewGroup && (
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder={t('budget.enterGroupName')}
                  className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              )}
              
              {existingGroups.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center mb-2">
                    <input
                      type="radio"
                      id="add-to-existing"
                      name="group-option"
                      checked={!createNewGroup}
                      onChange={() => setCreateNewGroup(false)}
                      className="mr-2"
                    />
                    <label htmlFor="add-to-existing" className="text-gray-700 dark:text-gray-300">
                      {t('budget.addToExistingGroup')}
                    </label>
                  </div>
                  
                  {!createNewGroup && (
                    <select
                      value={selectedGroup}
                      onChange={(e) => setSelectedGroup(e.target.value)}
                      className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {existingGroups.map((group) => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeGroupModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
              >
                {t('common.cancel')}
              </button>
              
              <button
                onClick={handleCreateOrUpdateGroup}
                disabled={loading || (createNewGroup && !groupName.trim())}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
              >
                {loading ? t('common.processing') : t('common.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BudgetGroupManager;
