import React, { useState, useEffect } from 'react';
import {
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  ExclamationCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';
import ExportLogsModal from '../../components/admin/ExportLogsModal';
import LogFilterModal from '../../components/admin/LogFilterModal';

const LogsPage = () => {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [limit] = useState(10);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    level: 'all',
    search: ''
  });

  // Função para buscar logs
  const fetchLogs = async () => {
    try {
      setLoading(true);
      
      // Construir parâmetros de consulta
      const params = new URLSearchParams({
        page: currentPage,
        limit: limit
      });
      
      if (filters.type !== 'all') {
        params.append('type', filters.type);
      }
      
      if (filters.level !== 'all') {
        params.append('level', filters.level);
      }
      
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      const response = await api.get(`/admin/logs?${params.toString()}`);
      
      if (response.data && response.data.success) {
        setLogs(response.data.data.logs);
        setTotalPages(response.data.data.totalPages);
        setTotalLogs(response.data.data.totalLogs);
      } else {
        console.error('Erro ao carregar logs:', response.data?.message || 'Resposta inválida');
        
        // Dados de exemplo para desenvolvimento
        const mockLogs = generateMockLogs();
        setLogs(mockLogs);
        setTotalPages(5);
        setTotalLogs(mockLogs.length * 5);
      }
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
      
      // Dados de exemplo para desenvolvimento
      const mockLogs = generateMockLogs();
      setLogs(mockLogs);
      setTotalPages(5);
      setTotalLogs(mockLogs.length * 5);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filters]);

  // Gerar logs de exemplo para desenvolvimento
  const generateMockLogs = () => {
    const types = ['login', 'logout', 'create', 'update', 'delete', 'view', 'export', 'import', 'system'];
    const levels = ['info', 'warning', 'error', 'critical'];
    const users = [
      { id: '1', name: 'Admin', email: 'admin@docai.com.br' },
      { id: '2', name: 'João Silva', email: 'joao@example.com' },
      { id: '3', name: 'Maria Santos', email: 'maria@example.com' },
      { id: null, name: 'Sistema', email: null }
    ];
    
    const mockLogs = [];
    
    for (let i = 0; i < 10; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const level = levels[Math.floor(Math.random() * levels.length)];
      const user = users[Math.floor(Math.random() * users.length)];
      const date = new Date();
      date.setMinutes(date.getMinutes() - i * 30);
      
      let message = '';
      let details = {};
      
      switch (type) {
        case 'login':
          message = `Usuário ${user.name} fez login no sistema`;
          details = { ip: '192.168.1.' + Math.floor(Math.random() * 255), userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' };
          break;
        case 'logout':
          message = `Usuário ${user.name} fez logout do sistema`;
          details = { ip: '192.168.1.' + Math.floor(Math.random() * 255) };
          break;
        case 'create':
          message = `Usuário ${user.name} criou um novo documento`;
          details = { documentId: 'doc-' + Math.floor(Math.random() * 1000), documentName: 'Documento ' + Math.floor(Math.random() * 100) };
          break;
        case 'update':
          message = `Usuário ${user.name} atualizou um documento`;
          details = { documentId: 'doc-' + Math.floor(Math.random() * 1000), documentName: 'Documento ' + Math.floor(Math.random() * 100) };
          break;
        case 'delete':
          message = `Usuário ${user.name} excluiu um documento`;
          details = { documentId: 'doc-' + Math.floor(Math.random() * 1000), documentName: 'Documento ' + Math.floor(Math.random() * 100) };
          break;
        case 'view':
          message = `Usuário ${user.name} visualizou um documento`;
          details = { documentId: 'doc-' + Math.floor(Math.random() * 1000), documentName: 'Documento ' + Math.floor(Math.random() * 100) };
          break;
        case 'export':
          message = `Usuário ${user.name} exportou dados`;
          details = { format: 'CSV', count: Math.floor(Math.random() * 100) };
          break;
        case 'import':
          message = `Usuário ${user.name} importou dados`;
          details = { format: 'CSV', count: Math.floor(Math.random() * 100) };
          break;
        case 'system':
          message = 'Backup automático realizado';
          details = { size: Math.floor(Math.random() * 1000) + 'MB', duration: Math.floor(Math.random() * 60) + 's' };
          break;
        default:
          message = 'Ação desconhecida';
      }
      
      mockLogs.push({
        id: 'log-' + i,
        type,
        level,
        message,
        details,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        ip: details.ip || '127.0.0.1',
        userAgent: details.userAgent || 'Unknown',
        createdAt: date.toISOString()
      });
    }
    
    return mockLogs;
  };

  // Formatar data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Navegar para a página anterior
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Navegar para a próxima página
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Aplicar filtros
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // Buscar por texto
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setFilters({ ...filters, search: e.target.value });
      setCurrentPage(1);
    }
  };

  // Obter classe de cor para o nível do log
  const getLevelClass = (level) => {
    switch (level) {
      case 'info':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'critical':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  // Obter ícone para o nível do log
  const getLevelIcon = (level) => {
    switch (level) {
      case 'info':
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'error':
      case 'critical':
        return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Logs do Sistema
        </h2>
        <div className="flex space-x-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Pesquisar logs..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              defaultValue={filters.search}
              onKeyDown={handleSearch}
            />
          </div>
          <button
            onClick={() => setShowFilterModal(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filtrar
          </button>
          <button
            onClick={() => setShowExportModal(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* Filtros ativos */}
      {(filters.type !== 'all' || filters.level !== 'all' || filters.search) && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Filtros ativos:
          </span>
          
          {filters.type !== 'all' && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Tipo: {filters.type}
            </span>
          )}
          
          {filters.level !== 'all' && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Nível: {filters.level}
            </span>
          )}
          
          {filters.search && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Busca: "{filters.search}"
            </span>
          )}
          
          <button
            onClick={() => handleApplyFilters({ type: 'all', level: 'all', search: '' })}
            className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
          >
            Limpar filtros
          </button>
        </div>
      )}

      {/* Tabela de logs */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Data/Hora
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Nível
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Usuário
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ação
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Detalhes
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  IP
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-500"></div>
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Nenhum log encontrado
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {formatDate(log.createdAt)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelClass(log.level)}`}>
                        {getLevelIcon(log.level)}
                        <span className="ml-1">{log.level}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{log.userName || 'Sistema'}</div>
                      {log.userEmail && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">{log.userEmail}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {log.type}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">{log.message}</div>
                      {log.details && Object.keys(log.details).length > 0 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {Object.entries(log.details).map(([key, value]) => (
                            <div key={key}>
                              <span className="font-medium">{key}:</span> {value}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {log.ip}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginação */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Mostrando {(currentPage - 1) * limit + 1} a {Math.min(currentPage * limit, totalLogs)} de {totalLogs} registros
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            Anterior
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            Próximo
            <ChevronRightIcon className="h-5 w-5 ml-1" />
          </button>
        </div>
      </div>

      {/* Modal de filtros */}
      <LogFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        onApplyFilters={handleApplyFilters}
      />

      {/* Modal de exportação */}
      <ExportLogsModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        filters={filters}
      />
    </div>
  );
};

export default LogsPage;
