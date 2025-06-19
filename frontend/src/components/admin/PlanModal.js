import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { XMarkIcon } from '@heroicons/react/24/outline';

const PlanModal = ({ isOpen, onClose, onSave, plan = null }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    billingCycle: 'monthly',
    features: '',
    storageLimit: '',
    documentLimit: '',
    aiAnalysisLimit: '',
    isPopular: false,
    isActive: true,
    displayOrder: 0
  });

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name || '',
        description: plan.description || '',
        price: plan.price ? String(plan.price) : '',
        billingCycle: plan.billingCycle || 'monthly',
        features: Array.isArray(plan.features) ? plan.features.join('\n') : '',
        storageLimit: plan.storageLimit ? String(plan.storageLimit) : '',
        documentLimit: plan.documentLimit ? String(plan.documentLimit) : '',
        aiAnalysisLimit: plan.aiAnalysisLimit ? String(plan.aiAnalysisLimit) : '',
        isPopular: plan.isPopular || false,
        isActive: plan.isActive !== undefined ? plan.isActive : true,
        displayOrder: plan.displayOrder || 0
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        billingCycle: 'monthly',
        features: '',
        storageLimit: '',
        documentLimit: '',
        aiAnalysisLimit: '',
        isPopular: false,
        isActive: true,
        displayOrder: 0
      });
    }
  }, [plan]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Converter valores numéricos
    const processedData = {
      ...formData,
      price: parseFloat(formData.price),
      storageLimit: parseInt(formData.storageLimit, 10),
      documentLimit: parseInt(formData.documentLimit, 10),
      aiAnalysisLimit: parseInt(formData.aiAnalysisLimit, 10),
      displayOrder: parseInt(formData.displayOrder, 10),
      features: formData.features.split('\n').filter(feature => feature.trim() !== '')
    };
    
    onSave(processedData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {plan ? t('admin.plans.modal.edit_title') : t('admin.plans.modal.add_title')}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('admin.plans.modal.name')}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('admin.plans.modal.price')} (R$)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('admin.plans.modal.description')}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              ></textarea>
            </div>
            
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('admin.plans.modal.billing_cycle')}
              </label>
              <select
                name="billingCycle"
                value={formData.billingCycle}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="monthly">{t('admin.plans.billing_cycle.monthly')}</option>
                <option value="yearly">{t('admin.plans.billing_cycle.yearly')}</option>
              </select>
            </div>
            
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('admin.plans.modal.display_order')}
              </label>
              <input
                type="number"
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('admin.plans.modal.storage_limit')} (MB)
              </label>
              <input
                type="number"
                name="storageLimit"
                value={formData.storageLimit}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('admin.plans.modal.document_limit')}
              </label>
              <input
                type="number"
                name="documentLimit"
                value={formData.documentLimit}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('admin.plans.modal.ai_analysis_limit')}
              </label>
              <input
                type="number"
                name="aiAnalysisLimit"
                value={formData.aiAnalysisLimit}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('admin.plans.modal.features')} (um por linha)
              </label>
              <textarea
                name="features"
                value={formData.features}
                onChange={handleChange}
                rows="5"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="Armazenamento ilimitado&#10;Suporte 24/7&#10;Acesso a todos os recursos"
              ></textarea>
            </div>
            
            <div className="col-span-1 flex items-center">
              <input
                type="checkbox"
                id="isPopular"
                name="isPopular"
                checked={formData.isPopular}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="isPopular" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                {t('admin.plans.modal.is_popular')}
              </label>
            </div>
            
            <div className="col-span-1 flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                {t('admin.plans.modal.is_active')}
              </label>
            </div>
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
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanModal;
