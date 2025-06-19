import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DocumentTextIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const AdminDocumentsPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');


  useEffect(() => {
    // Carregar documentos reais da API
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        // Exemplo de chamada real à API. Ajuste a URL conforme necessário.
        const response = await fetch('/api/admin/documents');
        const data = await response.json();
        setDocuments(data.documents || []);
      } catch (err) {
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

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

  // Filtrar documentos com base na categoria e termo de busca
  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         doc.userName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Função para abrir modal de exclusão de documento (desabilitada pois não há mais modal)
  const handleDeleteDocument = () => {
    // Modal removido
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
            {t('admin.documents.title')}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t('admin.documents.subtitle')}
          </p>
        </div>
      </div>

      {/* Barra de pesquisa e filtros */}
      <div className="mb-6 bg-white dark:bg-gray-800 shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <div className="max-w-lg w-full lg:max-w-xs">
              <label htmlFor="search" className="sr-only">{t('admin.documents.search')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder={t('admin.documents.search')}
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
            <div>
              <label htmlFor="category" className="sr-only">Categoria</label>
              <select
                id="category"
                name="category"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">{t('admin.documents.categories.all')}</option>
                <option value="saude">{t('admin.documents.categories.health')}</option>
                <option value="financeiro">{t('admin.documents.categories.financial')}</option>
                <option value="juridico">{t('admin.documents.categories.legal')}</option>
              </select>
            </div>
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <FunnelIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
              {t('admin.documents.filter')}
            </button>
          </div>
        </div>
      </div>

      {/* Lista de documentos */}
      {filteredDocuments.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredDocuments.map((document) => (
              <li key={document.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DocumentTextIcon className="h-5 w-5 text-gray-500" />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {document.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {t('admin.documents.user')}: {document.userName}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col items-end">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(document.createdAt)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {formatFileSize(document.fileSize)}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteDocument(document)}
                          className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md p-6 text-center">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">{t('admin.documents.no_documents')}</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm || selectedCategory !== 'all' 
              ? t('admin.documents.adjust_filters')
              : t('admin.documents.no_documents')}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminDocumentsPage;
