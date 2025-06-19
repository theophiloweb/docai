import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  DocumentTextIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  PlusIcon,
  EyeIcon,
  TrashIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';
import DocumentUploadModal from '../../components/documents/DocumentUploadModal';
import { toast } from 'react-toastify';

const DocumentsPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  
  const documentsPerPage = 10;

  // Carregar documentos
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const response = await api.get('/documents', {
          params: {
            page: currentPage,
            limit: documentsPerPage,
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            search: searchTerm || undefined
          }
        });
        
        if (response.data.success) {
          setDocuments(response.data.data.documents);
          setTotalPages(Math.ceil(response.data.data.total / documentsPerPage));
        } else {
          console.error('Erro ao carregar documentos:', response.data.message);
          setError('Falha ao carregar documentos. Tente novamente mais tarde.');
        }
      } catch (error) {
        console.error('Erro ao carregar documentos:', error);
        setError('Falha ao carregar documentos. Tente novamente mais tarde.');
        
        // Dados de exemplo para desenvolvimento
        const mockDocuments = [
          {
            id: '1',
            title: 'Exame de Sangue',
            description: 'Resultado do exame de sangue completo',
            category: 'saude',
            createdAt: '2025-06-01T10:30:00Z',
            status: 'analyzed'
          },
          {
            id: '2',
            title: 'Fatura de Energia',
            description: 'Fatura de energia elétrica do mês de maio',
            category: 'financeiro',
            createdAt: '2025-05-28T14:15:00Z',
            status: 'analyzed'
          },
          {
            id: '3',
            title: 'Orçamento Reforma',
            description: 'Orçamento para reforma da cozinha',
            category: 'orcamento',
            createdAt: '2025-05-25T09:45:00Z',
            status: 'processing'
          },
          {
            id: '4',
            title: 'Receita Médica',
            description: 'Prescrição de medicamentos',
            category: 'saude',
            createdAt: '2025-05-20T16:30:00Z',
            status: 'analyzed'
          },
          {
            id: '5',
            title: 'Extrato Bancário',
            description: 'Extrato bancário do mês de abril',
            category: 'financeiro',
            createdAt: '2025-05-15T11:20:00Z',
            status: 'analyzed'
          }
        ];
        
        setDocuments(mockDocuments);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    
    // Executar a função para carregar os documentos
    fetchDocuments();
  }, [currentPage, selectedCategory, searchTerm]);

  // Função para formatar data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Abrir modal de upload
  const handleOpenUploadModal = () => {
    setShowUploadModal(true);
  };

  // Fechar modal de upload
  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
  };

  // Processar upload de documento
  const handleDocumentUpload = async (processedData) => {
    try {
      // Recarregar documentos após processamento bem-sucedido
      const updatedResponse = await api.get('/documents', {
        params: {
          page: currentPage,
          limit: documentsPerPage,
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          search: searchTerm || undefined
        }
      });
      
      if (updatedResponse.data.success) {
        setDocuments(updatedResponse.data.data.documents);
        setTotalPages(Math.ceil(updatedResponse.data.data.total / documentsPerPage));
        toast.success('Documento processado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao atualizar lista de documentos:', error);
      toast.error('Erro ao atualizar lista de documentos. Tente novamente mais tarde.');
    }
  };

  // Confirmar exclusão de documento
  const confirmDelete = (document) => {
    setDocumentToDelete(document);
    setShowDeleteConfirm(true);
  };

  // Cancelar exclusão
  const cancelDelete = () => {
    setDocumentToDelete(null);
    setShowDeleteConfirm(false);
  };

  // Excluir documento
  const handleDeleteDocument = async () => {
    if (!documentToDelete) return;
    
    try {
      const response = await api.delete(`/documents/${documentToDelete.id}`);
      
      if (response.data.success) {
        toast.success('Documento excluído com sucesso!');
        
        // Atualizar lista de documentos
        setDocuments(documents.filter(doc => doc.id !== documentToDelete.id));
      } else {
        toast.error(response.data.message || 'Erro ao excluir documento');
      }
    } catch (error) {
      console.error('Erro ao excluir documento:', error);
      toast.error('Erro ao excluir documento. Tente novamente mais tarde.');
    } finally {
      setDocumentToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  // Visualizar documento
  const handleViewDocument = (document) => {
    // Implementar visualização do documento
    window.open(`/dashboard/documents/${document.id}`, '_blank');
  };

  // Mudar página
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('documents.title')}</h1>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            onClick={handleOpenUploadModal}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            {t('documents.upload')}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Voltar para a primeira página ao pesquisar
                  }}
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder={t('documents.search')}
                />
              </div>
            </div>
            <div className="sm:col-span-3">
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FunnelIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1); // Voltar para a primeira página ao filtrar
                  }}
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="all">{t('documents.categories.all')}</option>
                  <option value="financeiro">{t('documents.categories.financial')}</option>
                  <option value="saude">{t('documents.categories.health')}</option>
                  <option value="juridico">{t('documents.categories.legal')}</option>
                  <option value="pessoal">{t('documents.categories.personal')}</option>
                  <option value="trabalho">{t('documents.categories.work')}</option>
                  <option value="educacao">Educação</option>
                  <option value="orcamento">Orçamentos</option>
                  <option value="outros">{t('documents.categories.other')}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {documents.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {documents.map((document) => (
              <li key={document.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded p-2 mr-4">
                      <DocumentTextIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{document.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{document.description}</p>
                    </div>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      document.status === 'analyzed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : document.status === 'processing' 
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {document.status === 'analyzed' 
                        ? t('documents.status.analyzed') 
                        : document.status === 'processing' 
                          ? t('documents.status.processing')
                          : t('documents.status.error')}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 capitalize">
                        {document.category}
                      </span>
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                    <p className="mr-4">
                      {formatDate(document.createdAt)}
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDocument(document)}
                        className="inline-flex items-center p-1.5 border border-transparent rounded-full text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        title="Visualizar"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => confirmDelete(document)}
                        className="inline-flex items-center p-1.5 border border-transparent rounded-full text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        title="Excluir"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          
          {/* Paginação */}
          {totalPages > 1 && (
            <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                    currentPage === 1
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  Anterior
                </button>
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                    currentPage === totalPages
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  Próximo
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Mostrando <span className="font-medium">{(currentPage - 1) * documentsPerPage + 1}</span> a{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * documentsPerPage, documents.length + (currentPage - 1) * documentsPerPage)}
                    </span>{' '}
                    de <span className="font-medium">{documents.length + (currentPage - 1) * documentsPerPage}</span> resultados
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 text-sm font-medium ${
                        currentPage === 1
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                          : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="sr-only">Anterior</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {/* Números de página */}
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium ${
                          currentPage === i + 1
                            ? 'bg-primary-50 dark:bg-primary-900 border-primary-500 text-primary-600 dark:text-primary-400'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 text-sm font-medium ${
                        currentPage === totalPages
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                          : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="sr-only">Próximo</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6 text-center">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">{t('documents.empty')}</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Nenhum documento encontrado com os filtros atuais.' 
                : 'Comece fazendo upload do seu primeiro documento.'}
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={handleOpenUploadModal}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                {t('documents.upload')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de upload de documento */}
      <DocumentUploadModal
        isOpen={showUploadModal}
        onClose={handleCloseUploadModal}
        onSuccess={handleDocumentUpload}
      />

      {/* Modal de confirmação de exclusão */}
      {showDeleteConfirm && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                    <TrashIcon className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Excluir documento
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Tem certeza que deseja excluir o documento "{documentToDelete?.title}"? Esta ação não pode ser desfeita.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDeleteDocument}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Excluir
                </button>
                <button
                  type="button"
                  onClick={cancelDelete}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;
