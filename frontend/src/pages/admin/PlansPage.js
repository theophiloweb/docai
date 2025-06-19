import React, { useState, useEffect } from 'react';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';
import { toast } from 'react-toastify';
import PlanModal from '../../components/admin/PlanModal';

const PlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  // Carregar planos
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/plans');
      
      if (response.data && response.data.success) {
        console.log('Planos recebidos:', response.data.data.plans);
        setPlans(response.data.data.plans);
      } else {
        console.error('Erro ao carregar planos:', response.data?.message || 'Resposta inválida');
        setError('Falha ao carregar planos. Tente novamente mais tarde.');
        
        // Dados de exemplo para desenvolvimento
        setPlans(getMockPlans());
      }
    } catch (error) {
      console.error('Erro ao carregar planos:', error);
      setError('Falha ao carregar planos. Tente novamente mais tarde.');
      
      // Dados de exemplo para desenvolvimento
      setPlans(getMockPlans());
    } finally {
      setLoading(false);
    }
  };

  // Carregar planos ao montar o componente
  useEffect(() => {
    fetchPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dados de exemplo para desenvolvimento
  const getMockPlans = () => {
    return [
      {
        id: '1',
        name: 'Plano Básico',
        description: 'Para usuários iniciantes',
        price: 29.90,
        billingCycle: 'monthly',
        features: ['Armazenamento de 5GB', 'Até 100 documentos', '10 análises de IA por mês'],
        storageLimit: 5000,
        documentLimit: 100,
        aiAnalysisLimit: 10,
        isPopular: false,
        isActive: true,
        displayOrder: 1
      },
      {
        id: '2',
        name: 'Plano Premium',
        description: 'Para usuários avançados',
        price: 59.90,
        billingCycle: 'monthly',
        features: ['Armazenamento de 20GB', 'Até 500 documentos', '50 análises de IA por mês', 'Suporte prioritário'],
        storageLimit: 20000,
        documentLimit: 500,
        aiAnalysisLimit: 50,
        isPopular: true,
        isActive: true,
        displayOrder: 2
      },
      {
        id: '3',
        name: 'Plano Empresarial',
        description: 'Para pequenas empresas',
        price: 149.90,
        billingCycle: 'monthly',
        features: ['Armazenamento de 100GB', 'Documentos ilimitados', 'Análises de IA ilimitadas', 'Suporte 24/7', 'API de integração'],
        storageLimit: 100000,
        documentLimit: -1, // ilimitado
        aiAnalysisLimit: -1, // ilimitado
        isPopular: false,
        isActive: true,
        displayOrder: 3
      }
    ];
  };

  // Abrir modal para adicionar plano
  const handleAddPlan = () => {
    setCurrentPlan(null);
    setShowModal(true);
  };

  // Abrir modal para editar plano
  const handleEditPlan = (plan) => {
    setCurrentPlan(plan);
    setShowModal(true);
  };

  // Confirmar exclusão de plano
  const handleDeleteConfirmation = (plan) => {
    setDeleteConfirmation(plan);
  };

  // Cancelar exclusão
  const handleCancelDelete = () => {
    setDeleteConfirmation(null);
  };

  // Excluir plano
  const handleDeletePlan = async () => {
    if (!deleteConfirmation) return;
    
    try {
      const response = await api.delete(`/admin/plans/${deleteConfirmation.id}`);
      
      if (response.data && response.data.success) {
        toast.success('Plano excluído com sucesso');
        setPlans(plans.filter(plan => plan.id !== deleteConfirmation.id));
      } else {
        toast.error('Erro ao excluir plano');
      }
    } catch (error) {
      console.error('Erro ao excluir plano:', error);
      toast.error('Erro ao excluir plano');
    } finally {
      setDeleteConfirmation(null);
    }
  };

  // Salvar plano (adicionar ou editar)
  const handleSavePlan = async (formData) => {
    try {
      let response;
      
      if (currentPlan) {
        // Editar plano existente
        response = await api.put(`/admin/plans/${currentPlan.id}`, formData);
        
        if (response.data && response.data.success) {
          toast.success('Plano atualizado com sucesso');
          
          // Atualizar plano na lista
          setPlans(plans.map(plan => 
            plan.id === currentPlan.id ? { ...plan, ...formData } : plan
          ));
        } else {
          toast.error('Erro ao atualizar plano');
        }
      } else {
        // Adicionar novo plano
        response = await api.post('/admin/plans', formData);
        
        if (response.data && response.data.success) {
          toast.success('Plano adicionado com sucesso');
          
          // Adicionar novo plano à lista
          setPlans([...plans, response.data.data.plan]);
        } else {
          toast.error('Erro ao adicionar plano');
        }
      }
      
      // Fechar modal
      setShowModal(false);
    } catch (error) {
      console.error('Erro ao salvar plano:', error);
      toast.error(currentPlan ? 'Erro ao atualizar plano' : 'Erro ao adicionar plano');
    }
  };

  // Alternar status do plano (ativo/inativo)
  const handleToggleStatus = async (plan) => {
    try {
      const newStatus = !plan.isActive;
      
      const response = await api.patch(`/admin/plans/${plan.id}/status`, {
        isActive: newStatus
      });
      
      if (response.data && response.data.success) {
        toast.success(newStatus ? 'Plano ativado com sucesso' : 'Plano desativado com sucesso');
        
        // Atualizar status do plano na lista
        setPlans(plans.map(p => 
          p.id === plan.id ? { ...p, isActive: newStatus } : p
        ));
      } else {
        toast.error(newStatus ? 'Erro ao ativar plano' : 'Erro ao desativar plano');
      }
    } catch (error) {
      console.error('Erro ao alterar status do plano:', error);
      toast.error(plan.isActive ? 'Erro ao desativar plano' : 'Erro ao ativar plano');
    }
  };

  // Formatar preço
  const formatPrice = (price, billingCycle) => {
    const formattedPrice = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
    
    return `${formattedPrice}/${billingCycle === 'monthly' ? 'mês' : 'ano'}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900 border-l-4 border-red-500 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Planos
        </h2>
        <button
          onClick={handleAddPlan}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Adicionar Plano
        </button>
      </div>

      {plans.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Nenhum plano encontrado
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden ${
                plan.isPopular ? 'ring-2 ring-primary-500' : ''
              }`}
            >
              {plan.isPopular && (
                <div className="bg-primary-500 text-white text-center py-1 text-sm font-medium">
                  Popular
                </div>
              )}
              
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {plan.description}
                    </p>
                  </div>
                  <div className={`flex items-center ${plan.isActive ? 'text-green-500' : 'text-red-500'}`}>
                    {plan.isActive ? (
                      <CheckCircleIcon className="h-5 w-5" />
                    ) : (
                      <XCircleIcon className="h-5 w-5" />
                    )}
                  </div>
                </div>
                
                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {formatPrice(plan.price, plan.billingCycle)}
                  </span>
                </div>
                
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Armazenamento:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {plan.storageLimit === -1 ? 'Ilimitado' : `${plan.storageLimit >= 1000 ? plan.storageLimit / 1000 : plan.storageLimit}${plan.storageLimit >= 1000 ? 'GB' : 'MB'}`}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Documentos:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {plan.documentLimit === -1 ? 'Ilimitado' : plan.documentLimit}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Análises de IA:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {plan.aiAnalysisLimit === -1 ? 'Ilimitado' : `${plan.aiAnalysisLimit}/mês`}
                    </span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Recursos:
                  </h4>
                  <ul className="space-y-2">
                    {Array.isArray(plan.features) && plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-6 flex justify-between">
                  <button
                    onClick={() => handleToggleStatus(plan)}
                    className={`px-3 py-1 rounded-md text-xs font-medium ${
                      plan.isActive
                        ? 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800'
                        : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800'
                    }`}
                  >
                    {plan.isActive ? 'Desativar' : 'Ativar'}
                  </button>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditPlan(plan)}
                      className="p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteConfirmation(plan)}
                      className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de edição/adição de plano */}
      <PlanModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSavePlan}
        plan={currentPlan}
      />

      {/* Modal de confirmação de exclusão */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Confirmar exclusão
                </h3>
              </div>
            </div>
            
            <div className="mt-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tem certeza que deseja excluir este plano? Esta ação não pode ser desfeita.
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white mt-2">
                {deleteConfirmation.name}
              </p>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeletePlan}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlansPage;
