import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { XMarkIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import { toast } from 'react-toastify';

const ExportLogsModal = ({ isOpen, onClose, filters }) => {
  const { t } = useTranslation();
  const [format, setFormat] = useState('csv');
  const [dateRange, setDateRange] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    try {
      setLoading(true);
      
      // Construir parâmetros de consulta
      const params = new URLSearchParams({
        format: format
      });
      
      // Adicionar filtros existentes
      if (filters.type !== 'all') {
        params.append('type', filters.type);
      }
      
      if (filters.level !== 'all') {
        params.append('level', filters.level);
      }
      
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      // Adicionar filtro de data
      if (dateRange === 'custom') {
        if (startDate) {
          params.append('startDate', startDate);
        }
        
        if (endDate) {
          params.append('endDate', endDate);
        }
      } else if (dateRange !== 'all') {
        params.append('dateRange', dateRange);
      }
      
      // Fazer requisição para exportar logs
      const response = await api.get(`/admin/logs/export?${params.toString()}`, {
        responseType: 'blob'
      });
      
      // Criar URL para download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `logs_${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success(t('admin.logs.export_success'));
      onClose();
    } catch (error) {
      console.error('Erro ao exportar logs:', error);
      toast.error(t('admin.logs.export_error'));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {t('admin.logs.export_title')}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('admin.logs.export_format')}
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="csv">CSV</option>
                <option value="json">JSON</option>
                <option value="xlsx">Excel (XLSX)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('admin.logs.date_range')}
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">{t('admin.logs.date_range_all')}</option>
                <option value="today">{t('admin.logs.date_range_today')}</option>
                <option value="yesterday">{t('admin.logs.date_range_yesterday')}</option>
                <option value="last7days">{t('admin.logs.date_range_last7days')}</option>
                <option value="last30days">{t('admin.logs.date_range_last30days')}</option>
                <option value="thisMonth">{t('admin.logs.date_range_thisMonth')}</option>
                <option value="lastMonth">{t('admin.logs.date_range_lastMonth')}</option>
                <option value="custom">{t('admin.logs.date_range_custom')}</option>
              </select>
            </div>
            
            {dateRange === 'custom' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('admin.logs.start_date')}
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('admin.logs.end_date')}
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {t('common.cancel')}
            </button>
            <button
              type="button"
              onClick={handleExport}
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? t('common.processing') : t('admin.logs.export')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportLogsModal;
