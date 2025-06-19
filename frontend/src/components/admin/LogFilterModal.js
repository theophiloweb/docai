import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { XMarkIcon } from '@heroicons/react/24/outline';

const LogFilterModal = ({ isOpen, onClose, filters, onApplyFilters }) => {
  const { t } = useTranslation();
  const [localFilters, setLocalFilters] = useState({ ...filters });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      type: 'all',
      level: 'all',
      search: ''
    };
    setLocalFilters(resetFilters);
    onApplyFilters(resetFilters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {t('admin.logs.filter_title')}
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
                {t('admin.logs.filter_type')}
              </label>
              <select
                name="type"
                value={localFilters.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">{t('common.all')}</option>
                <option value="login">{t('admin.logs.actions.login')}</option>
                <option value="logout">{t('admin.logs.actions.logout')}</option>
                <option value="create">{t('admin.logs.actions.create')}</option>
                <option value="update">{t('admin.logs.actions.update')}</option>
                <option value="delete">{t('admin.logs.actions.delete')}</option>
                <option value="view">{t('admin.logs.actions.view')}</option>
                <option value="export">{t('admin.logs.actions.export')}</option>
                <option value="import">{t('admin.logs.actions.import')}</option>
                <option value="system">{t('admin.logs.actions.system')}</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('admin.logs.filter_level')}
              </label>
              <select
                name="level"
                value={localFilters.level}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">{t('common.all')}</option>
                <option value="info">{t('admin.logs.levels.info')}</option>
                <option value="warning">{t('admin.logs.levels.warning')}</option>
                <option value="error">{t('admin.logs.levels.error')}</option>
                <option value="critical">{t('admin.logs.levels.critical')}</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('admin.logs.search')}
              </label>
              <input
                type="text"
                name="search"
                value={localFilters.search}
                onChange={handleChange}
                placeholder={t('admin.logs.search_placeholder')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {t('admin.logs.reset_filters')}
            </button>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {t('admin.logs.apply_filters')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogFilterModal;
