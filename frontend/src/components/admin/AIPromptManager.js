import React, { useState, useEffect } from 'react';
import { 
  PencilIcon, 
  TrashIcon, 
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';
import { toast } from 'react-toastify';

const AIPromptManager = () => {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    prompt: '',
    category: 'general',
    isActive: true
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  // Carregar prompts
  const fetchPrompts = async () => {
    try {
      setLoading(true);
      
      // Tentar obter prompts da API
      const response = await api.get('/ai/prompts');
      
      if (response.data && response.data.success) {
        setPrompts(response.data.data.prompts);
      } else {
        // Se falhar, usar dados de exemplo
        setPrompts(getMockPrompts());
      }
    } catch (error) {
      console.error('Erro ao carregar prompts:', error);
      setError('Falha ao carregar prompts. Tente novamente mais tarde.');
      
      // Usar dados de exemplo em caso de erro
      setPrompts(getMockPrompts());
    } finally {
      setLoading(false);
    }
  };

  // Carregar prompts ao montar o componente
  useEffect(() => {
    fetchPrompts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dados de exemplo para desenvolvimento
  const getMockPrompts = () => {
    return [
      {
        id: '1',
        title: 'Análise de Orçamentos',
        description: 'Prompt para análise comparativa de orçamentos',
        prompt: generateBudgetAnalysisPrompt(),
        category: 'budget',
        isActive: true,
        createdAt: '2025-05-15T10:30:00Z',
        updatedAt: '2025-06-01T14:20:00Z'
      },
      {
        id: '2',
        title: 'Comparação de Orçamentos',
        description: 'Prompt para comparação detalhada entre orçamentos do mesmo produto',
        prompt: generateBudgetComparisonPrompt(),
        category: 'budget',
        isActive: true,
        createdAt: '2025-05-16T09:15:00Z',
        updatedAt: '2025-06-02T11:45:00Z'
      },
      {
        id: '3',
        title: 'Análise de Documentos Médicos',
        description: 'Prompt para extrair informações relevantes de documentos médicos',
        prompt: generateMedicalAnalysisPrompt(),
        category: 'medical',
        isActive: true,
        createdAt: '2025-05-20T14:30:00Z',
        updatedAt: '2025-06-05T16:20:00Z'
      },
      {
        id: '4',
        title: 'Análise Financeira',
        description: 'Prompt para análise de documentos financeiros',
        prompt: generateFinancialAnalysisPrompt(),
        category: 'financial',
        isActive: false,
        createdAt: '2025-05-22T11:30:00Z',
        updatedAt: '2025-06-10T09:15:00Z'
      }
    ];
  };

  // Exemplos de prompts
  const generateBudgetAnalysisPrompt = () => {
    return `Você é um consultor financeiro especializado em análise de custo-benefício e comparação de orçamentos para compras pessoais. 
Sua tarefa é analisar detalhadamente os seguintes grupos de orçamentos e fornecer insights valiosos e recomendações personalizadas.

IMPORTANTE: Não se limite apenas ao preço mais baixo. Considere todos os fatores que impactam o valor real da compra:
- Reputação do fornecedor (pontuação no ReclameAqui)
- Prazo de entrega (quanto menor, melhor)
- Garantia (quanto maior o período, melhor)
- Avaliações do produto
- Taxa de depreciação do produto
- Custos adicionais como frete
- Fatores de risco identificados

Para cada grupo de orçamentos, você deve:
1. Identificar a melhor opção considerando todos os fatores
2. Explicar detalhadamente por que esta é a melhor escolha
3. Apontar possíveis armadilhas ou riscos em cada opção
4. Sugerir estratégias de negociação ou economia
5. Explicar por que as outras opções não foram selecionadas`;
  };

  const generateBudgetComparisonPrompt = () => {
    return `Você é um consultor especializado em análise de custo-benefício e tomada de decisão para compras pessoais.
  
Analise detalhadamente os seguintes orçamentos para o produto e forneça uma recomendação clara e bem fundamentada.

IMPORTANTE: Sua análise deve ir além do preço mais baixo. Considere todos os fatores que impactam o valor real da compra:
- Reputação do fornecedor (pontuação no ReclameAqui)
- Prazo de entrega (quanto menor, melhor)
- Garantia (quanto maior o período, melhor)
- Avaliações do produto
- Taxa de depreciação do produto
- Custos adicionais como frete
- Fatores de risco identificados`;
  };

  const generateMedicalAnalysisPrompt = () => {
    return `Você é um assistente especializado em análise de documentos médicos.
    
Sua tarefa é extrair e organizar informações relevantes dos documentos médicos fornecidos.
Identifique e estruture as seguintes informações quando disponíveis:

1. Dados do paciente (nome, idade, gênero)
2. Tipo de exame ou procedimento
3. Data do exame ou procedimento
4. Resultados principais e valores de referência
5. Diagnósticos mencionados
6. Recomendações médicas
7. Medicamentos prescritos e posologia
8. Alergias ou contraindicações mencionadas

Apresente as informações de forma estruturada e organizada.
Não faça suposições médicas além do que está explicitamente mencionado no documento.
Indique claramente quando uma informação solicitada não estiver disponível no documento.`;
  };

  const generateFinancialAnalysisPrompt = () => {
    return `Você é um assistente especializado em análise de documentos financeiros.
    
Sua tarefa é extrair e organizar informações relevantes dos documentos financeiros fornecidos.
Identifique e estruture as seguintes informações quando disponíveis:

1. Tipo de documento financeiro
2. Data do documento
3. Valores principais (receitas, despesas, saldo)
4. Categorias de despesas identificadas
5. Fontes de receita identificadas
6. Tendências financeiras observáveis
7. Alertas sobre valores incomuns ou discrepantes
8. Recomendações para otimização financeira

Apresente as informações de forma estruturada e organizada.
Não faça suposições financeiras além do que está explicitamente mencionado no documento.
Indique claramente quando uma informação solicitada não estiver disponível no documento.`;
  };

  // Abrir modal para editar prompt
  const handleEditPrompt = (prompt) => {
    setCurrentPrompt(prompt);
    setFormData({
      title: prompt.title,
      description: prompt.description,
      prompt: prompt.prompt,
      category: prompt.category,
      isActive: prompt.isActive
    });
    setShowModal(true);
  };

  // Fechar modal
  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentPrompt(null);
    setFormData({
      title: '',
      description: '',
      prompt: '',
      category: 'general',
      isActive: true
    });
  };

  // Atualizar campo do formulário
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Salvar prompt
  const handleSavePrompt = async () => {
    try {
      if (!currentPrompt) return;
      
      // Atualizar prompt na API
      const response = await api.put(`/ai/prompts/${currentPrompt.id}`, formData);
      
      if (response.data && response.data.success) {
        // Atualizar prompt na lista
        setPrompts(prompts.map(p => 
          p.id === currentPrompt.id ? { ...p, ...formData } : p
        ));
        
        toast.success('Prompt atualizado com sucesso');
        handleCloseModal();
      } else {
        toast.error('Erro ao atualizar prompt');
      }
    } catch (error) {
      console.error('Erro ao salvar prompt:', error);
      toast.error('Erro ao atualizar prompt');
    }
  };

  // Confirmar exclusão de prompt
  const handleDeleteConfirmation = (prompt) => {
    setDeleteConfirmation(prompt);
  };

  // Cancelar exclusão
  const handleCancelDelete = () => {
    setDeleteConfirmation(null);
  };

  // Excluir prompt
  const handleDeletePrompt = async () => {
    try {
      if (!deleteConfirmation) return;
      
      // Excluir prompt na API
      const response = await api.delete(`/ai/prompts/${deleteConfirmation.id}`);
      
      if (response.data && response.data.success) {
        // Remover prompt da lista
        setPrompts(prompts.filter(p => p.id !== deleteConfirmation.id));
        
        toast.success('Prompt excluído com sucesso');
        setDeleteConfirmation(null);
      } else {
        toast.error('Erro ao excluir prompt');
      }
    } catch (error) {
      console.error('Erro ao excluir prompt:', error);
      toast.error('Erro ao excluir prompt');
    }
  };

  // Alternar status do prompt
  const handleToggleStatus = async (prompt) => {
    try {
      const newStatus = !prompt.isActive;
      
      // Atualizar status na API
      const response = await api.patch(`/ai/prompts/${prompt.id}/status`, {
        isActive: newStatus
      });
      
      if (response.data && response.data.success) {
        // Atualizar status na lista
        setPrompts(prompts.map(p => 
          p.id === prompt.id ? { ...p, isActive: newStatus } : p
        ));
        
        toast.success(newStatus ? 'Prompt ativado com sucesso' : 'Prompt desativado com sucesso');
      } else {
        toast.error('Erro ao atualizar status do prompt');
      }
    } catch (error) {
      console.error('Erro ao alternar status do prompt:', error);
      toast.error('Erro ao atualizar status do prompt');
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900 border-l-4 border-red-500 p-4">
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
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Prompts de IA
      </h3>
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Título
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Categoria
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Descrição
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Atualizado
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {prompts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Nenhum prompt encontrado
                  </td>
                </tr>
              ) : (
                prompts.map((prompt) => (
                  <tr key={prompt.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {prompt.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {prompt.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {prompt.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(prompt.updatedAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(prompt)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          prompt.isActive
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                      >
                        {prompt.isActive ? (
                          <>
                            <CheckIcon className="h-4 w-4 mr-1" />
                            Ativo
                          </>
                        ) : (
                          <>
                            <XMarkIcon className="h-4 w-4 mr-1" />
                            Inativo
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditPrompt(prompt)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteConfirmation(prompt)}
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

      {/* Modal de edição de prompt */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Editar Prompt
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Descrição
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Categoria
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="general">Geral</option>
                    <option value="budget">Orçamento</option>
                    <option value="medical">Médico</option>
                    <option value="financial">Financeiro</option>
                    <option value="legal">Jurídico</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Conteúdo do Prompt
                  </label>
                  <textarea
                    name="prompt"
                    value={formData.prompt}
                    onChange={handleChange}
                    rows="10"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
                  ></textarea>
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
                  onClick={handleSavePrompt}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  Excluir Prompt
                </h3>
              </div>
            </div>
            
            <div className="mt-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tem certeza que deseja excluir este prompt? Esta ação não pode ser desfeita.
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white mt-2">
                {deleteConfirmation.title}
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
                onClick={handleDeletePrompt}
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

export default AIPromptManager;
