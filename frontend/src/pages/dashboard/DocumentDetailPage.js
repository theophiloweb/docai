import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  // ShareIcon,
  InformationCircleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const DocumentDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [document, setDocument] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/documents/${id}`);
        
        if (response.data.success) {
          setDocument(response.data.data.document);
        } else {
          setError(response.data.message || 'Erro ao carregar documento');
        }
      } catch (error) {
        console.error('Erro ao carregar documento:', error);
        setError('Erro ao carregar documento. Tente novamente mais tarde.');
        
        // Dados simulados para desenvolvimento em caso de erro
        setDocument({
          id,
          title: 'Exame de Sangue',
          description: 'Exame de sangue completo realizado em 01/06/2025',
          category: 'saude',
          content: 'Este é um exame de sangue completo que inclui hemograma, glicemia, colesterol, triglicerídeos, etc.',
          createdAt: '2025-06-01T10:30:00Z',
          updatedAt: '2025-06-01T10:30:00Z',
          fileType: 'pdf',
          fileSize: 1024 * 1024, // 1MB
          aiSummary: 'Este exame de sangue mostra níveis normais de glicose, colesterol e triglicerídeos.'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocument();
  }, [id]);

  // Função para formatar data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Função para formatar tamanho de arquivo
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  // Função para excluir documento
  const handleDeleteDocument = async () => {
    try {
      const response = await api.delete(`/documents/${id}`);
      
      if (response.data.success) {
        // Redirecionar para a lista de documentos
        window.location.href = '/dashboard/documents';
      } else {
        setError(response.data.message || 'Erro ao excluir documento');
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error('Erro ao excluir documento:', error);
      setError('Erro ao excluir documento. Tente novamente mais tarde.');
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="bg-red-50 dark:bg-red-900 border-l-4 border-red-500 p-4">
        <p className="text-sm text-red-700 dark:text-red-300">
          {error || 'Documento não encontrado'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Cabeçalho */}
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <Link
            to="/dashboard/documents"
            className="inline-flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Voltar
          </Link>
          <h2 className="mt-2 text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
            {document.title}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {document.description}
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />
            Download
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <TrashIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />
            Excluir
          </button>
        </div>
      </div>

      {/* Abas */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`${
              activeTab === 'info'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('info')}
          >
            <InformationCircleIcon className="h-5 w-5 inline mr-1" />
            Informações
          </button>
          <button
            className={`${
              activeTab === 'summary'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('summary')}
          >
            <DocumentTextIcon className="h-5 w-5 inline mr-1" />
            Resumo
          </button>
        </nav>
      </div>

      {/* Conteúdo da aba */}
      <div className="mt-6">
        {activeTab === 'info' && (
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Informações do Documento
              </h3>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200 dark:sm:divide-gray-700">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Título
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                    {document.title}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Categoria
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                    {document.category}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Tipo de arquivo
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                    {document.fileType ? document.fileType.toUpperCase() : 'N/A'}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Tamanho
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                    {document.fileSize ? formatFileSize(document.fileSize) : 'N/A'}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Data do documento
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                    {document.documentDate ? formatDate(document.documentDate) : 'Data não identificada'}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Data de envio
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                    {formatDate(document.createdAt)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {activeTab === 'summary' && (
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Resumo Gerado por IA
              </h3>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
              {document.aiSummary ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Resumo:</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {document.aiSummary}
                    </p>
                  </div>
                  
                  {document.insights && (
                    <div>
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Pontos de Atenção:</h4>
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {typeof document.insights === 'string' ? (
                          <p>{JSON.parse(document.insights).pointsOfAttention || "Nenhum ponto de atenção identificado."}</p>
                        ) : (
                          <p>{document.insights.pointsOfAttention || "Nenhum ponto de atenção identificado."}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Nenhum resumo disponível para este documento.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal de confirmação de exclusão */}
      {showDeleteModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                  <TrashIcon className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Confirmar exclusão
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Tem certeza que deseja excluir este documento? Esta ação não pode ser desfeita.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDeleteDocument}
                >
                  Excluir
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
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

export default DocumentDetailPage;
