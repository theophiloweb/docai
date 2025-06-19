import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';
import openRouterService from '../../services/openRouterService';
import { toast } from 'react-toastify';
import AIPromptManager from '../../components/admin/AIPromptManager';

const AISettingsPage = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProvider, setCurrentProvider] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [modelsByProvider, setModelsByProvider] = useState({});

  // Formulário
  const [formData, setFormData] = useState({
    provider: 'openai',
    name: '',
    apiKey: '',
    model: '',
    isActive: true
  });

  // Opções de provedores
  const [providerOptions, setProviderOptions] = useState([
    { value: 'openai', label: 'OpenAI' },
    { value: 'anthropic', label: 'Anthropic' },
    { value: 'google', label: 'Google' },
    { value: 'meta', label: 'Meta' },
    { value: 'mistral', label: 'Mistral' },
    { value: 'llama', label: 'Llama' }
  ]);

  // Buscar modelos do OpenRouter
  const fetchOpenRouterModels = async () => {
    try {
      setLoadingModels(true);
      const models = await openRouterService.getAvailableModels();
      
      // Organizar modelos por provedor
      const organizedModels = {};
      const providers = [];
      
      models.forEach(model => {
        const providerName = model.id.split('/')[0];
        const modelName = model.id;
        
        if (!organizedModels[providerName]) {
          organizedModels[providerName] = [];
          providers.push({
            value: providerName,
            label: openRouterService.organizeModelsByProvider([model])[providerName].name
          });
        }
        
        organizedModels[providerName].push(modelName);
      });
      
      setModelsByProvider(organizedModels);
      setProviderOptions(providers);
      
      // Atualizar modelo padrão no formulário se necessário
      if (formData.provider && organizedModels[formData.provider]?.length > 0) {
        setFormData(prev => ({
          ...prev,
          model: organizedModels[formData.provider][0]
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar modelos do OpenRouter:', error);
      toast.error('Erro ao buscar modelos disponíveis. Usando lista local.');
      
      // Fallback para modelos estáticos
      setModelsByProvider({
        openai: ['gpt-4o', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'],
        anthropic: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku', 'claude-2'],
        google: ['gemini-pro', 'gemini-ultra'],
        meta: ['llama-3-70b', 'llama-3-8b'],
        mistral: ['mistral-large', 'mistral-medium', 'mistral-small']
      });
    } finally {
      setLoadingModels(false);
    }
  };

  // Carregar provedores de IA e modelos do OpenRouter
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Buscar modelos do OpenRouter
        await fetchOpenRouterModels();
        
        // Buscar provedores configurados
        const response = await api.get('/admin/ai-settings');
        
        if (response.data && response.data.success) {
          setProviders(response.data.data.providers);
        } else {
          console.error('Erro ao carregar provedores:', response.data?.message || 'Resposta inválida');
          setError('Falha ao carregar provedores de IA. Tente novamente mais tarde.');
          
          // Dados de exemplo para desenvolvimento
          setProviders([
            {
              id: '1',
              provider: 'llama',
              name: 'Llama 3',
              apiKey: '••••••••••••••••',
              model: 'meta/llama-3-70b',
              isActive: true,
              createdAt: '2025-05-01T10:30:00Z',
              updatedAt: '2025-06-01T14:20:00Z'
            },
            {
              id: '2',
              provider: 'openai',
              name: 'OpenAI GPT-4',
              apiKey: '••••••••••••••••',
              model: 'openai/gpt-4-turbo',
              isActive: false,
              createdAt: '2025-04-15T09:45:00Z',
              updatedAt: '2025-05-20T11:30:00Z'
            }
          ]);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError('Falha ao carregar dados. Tente novamente mais tarde.');
        
        // Dados de exemplo para desenvolvimento
        setProviders([
          {
            id: '1',
            provider: 'llama',
            name: 'Llama 3',
            apiKey: '••••••••••••••••',
            model: 'meta/llama-3-70b',
            isActive: true,
            createdAt: '2025-05-01T10:30:00Z',
            updatedAt: '2025-06-01T14:20:00Z'
          },
          {
            id: '2',
            provider: 'openai',
            name: 'OpenAI GPT-4',
            apiKey: '••••••••••••••••',
            model: 'openai/gpt-4-turbo',
            isActive: false,
            createdAt: '2025-04-15T09:45:00Z',
            updatedAt: '2025-05-20T11:30:00Z'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Abrir modal para adicionar provedor
  const handleAddProvider = () => {
    setCurrentProvider(null);
    setIsEditing(false);
    setFormData({
      provider: 'openai',
      name: '',
      apiKey: '',
      model: 'gpt-4-turbo',
      isActive: true
    });
    setIsModalOpen(true);
  };

  // Abrir modal para editar provedor
  const handleEditProvider = (provider) => {
    setCurrentProvider(provider);
    setIsEditing(true);
    setFormData({
      provider: provider.provider,
      name: provider.name,
      apiKey: '',  // Não exibir a chave API por segurança
      model: provider.model,
      isActive: provider.isActive
    });
    setIsModalOpen(true);
  };

  // Fechar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentProvider(null);
    setIsEditing(false);
  };

  // Atualizar campo do formulário
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'provider') {
      // Atualizar modelo quando o provedor mudar
      const defaultModel = modelsByProvider[value]?.[0] || '';
      setFormData(prev => ({
        ...prev,
        [name]: value,
        model: defaultModel
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // Salvar provedor
  const handleSaveProvider = async () => {
    try {
      if (isEditing) {
        // Editar provedor existente
        const response = await api.put(`/admin/ai-settings/${currentProvider.id}`, formData);
        
        if (response.data && response.data.success) {
          toast.success('Provedor atualizado com sucesso');
          
          // Atualizar provedor na lista
          setProviders(providers.map(provider => 
            provider.id === currentProvider.id ? { ...provider, ...formData, apiKey: '••••••••••••••••' } : provider
          ));
          
          handleCloseModal();
        } else {
          toast.error('Erro ao atualizar provedor');
        }
      } else {
        // Adicionar novo provedor
        const response = await api.post('/admin/ai-settings', formData);
        
        if (response.data && response.data.success) {
          toast.success('Provedor adicionado com sucesso');
          
          // Adicionar novo provedor à lista
          setProviders([...providers, { ...response.data.data.provider, apiKey: '••••••••••••••••' }]);
          
          handleCloseModal();
        } else {
          toast.error('Erro ao adicionar provedor');
        }
      }
    } catch (error) {
      console.error('Erro ao salvar provedor:', error);
      toast.error(isEditing ? 'Erro ao atualizar provedor' : 'Erro ao adicionar provedor');
    }
  };

  // Excluir provedor
  const handleDeleteProvider = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este provedor?')) return;
    
    try {
      const response = await api.delete(`/admin/ai-settings/${id}`);
      
      if (response.data && response.data.success) {
        toast.success('Provedor excluído com sucesso');
        
        // Remover provedor da lista
        setProviders(providers.filter(provider => provider.id !== id));
      } else {
        toast.error('Erro ao excluir provedor');
      }
    } catch (error) {
      console.error('Erro ao excluir provedor:', error);
      toast.error('Erro ao excluir provedor');
    }
  };

  // Testar conexão com provedor
  const handleTestConnection = async (provider) => {
    try {
      setIsTesting(true);
      
      const response = await api.post(`/admin/ai-settings/${provider.id}/test`);
      
      if (response.data && response.data.success) {
        toast.success('Conexão testada com sucesso');
      } else {
        toast.error('Erro ao testar conexão');
      }
    } catch (error) {
      console.error('Erro ao testar conexão:', error);
      toast.error('Erro ao testar conexão');
    } finally {
      setIsTesting(false);
    }
  };

  // Alternar status do provedor
  const handleToggleStatus = async (provider) => {
    try {
      const newStatus = !provider.isActive;
      
      const response = await api.patch(`/admin/ai-settings/${provider.id}/status`, {
        isActive: newStatus
      });
      
      if (response.data && response.data.success) {
        toast.success(newStatus ? 'Provedor ativado com sucesso' : 'Provedor desativado com sucesso');
        
        // Atualizar status do provedor na lista
        setProviders(providers.map(p => 
          p.id === provider.id ? { ...p, isActive: newStatus } : p
        ));
      } else {
        toast.error('Erro ao atualizar status do provedor');
      }
    } catch (error) {
      console.error('Erro ao alterar status do provedor:', error);
      toast.error('Erro ao atualizar status do provedor');
    }
  };

  // Formatar data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Configurações de IA
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={fetchOpenRouterModels}
            disabled={loadingModels}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <ArrowPathIcon className={`h-5 w-5 mr-1 ${loadingModels ? 'animate-spin' : ''}`} />
            {loadingModels ? 'Atualizando...' : 'Atualizar Modelos'}
          </button>
          <button
            onClick={handleAddProvider}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Adicionar Provedor
          </button>
        </div>
      </div>

      {error && (
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
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Provedor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Modelo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Atualizado
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {providers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      Nenhum provedor de IA encontrado
                    </td>
                  </tr>
                ) : (
                  providers.map((provider) => (
                    <tr key={provider.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                            <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                              {provider.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {provider.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {providerOptions.find(option => option.value === provider.provider)?.label || provider.provider}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{provider.model}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(provider)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            provider.isActive
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}
                        >
                          {provider.isActive ? (
                            <>
                              <CheckCircleIcon className="h-4 w-4 mr-1" />
                              Ativo
                            </>
                          ) : (
                            <>
                              <XCircleIcon className="h-4 w-4 mr-1" />
                              Inativo
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(provider.updatedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleTestConnection(provider)}
                          disabled={isTesting}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
                        >
                          Testar
                        </button>
                        <button
                          onClick={() => handleEditProvider(provider)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProvider(provider.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Gerenciador de Prompts de IA */}
      <AIPromptManager />

      {/* Modal para adicionar/editar provedor */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {isEditing ? 'Editar Provedor' : 'Adicionar Provedor'}
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="provider" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Provedor
                  </label>
                  <select
                    id="provider"
                    name="provider"
                    value={formData.provider}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  >
                    {providerOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Nome do provedor"
                  />
                </div>
                
                <div>
                  <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Chave API
                  </label>
                  <input
                    type="password"
                    id="apiKey"
                    name="apiKey"
                    value={formData.apiKey}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder={isEditing ? '••••••••••••••••' : 'Insira sua chave API'}
                  />
                </div>
                
                <div>
                  <label htmlFor="model" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Modelo
                  </label>
                  {loadingModels ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary-500"></div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Carregando modelos...</span>
                    </div>
                  ) : (
                    <select
                      id="model"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                      {modelsByProvider[formData.provider]?.map(model => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      )) || (
                        <option value="">Nenhum modelo disponível</option>
                      )}
                    </select>
                  )}
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Ativo
                  </label>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveProvider}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AISettingsPage;
