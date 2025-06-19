import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  CalendarIcon,
  UserIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Modal para confirmar os dados extraídos de um documento
 */
const DocumentConfirmationModal = ({ isOpen, onClose, documentData, onConfirm, onReject }) => {
  const { t } = useTranslation();
  const [useAiClassification, setUseAiClassification] = useState(true);
  
  // Verificar se há inconsistência na classificação
  const hasClassificationMismatch = documentData && 
                                   documentData.classificationMismatch && 
                                   documentData.classificationMismatch.confidence > 70;

  if (!isOpen) return null;

  // Formatar data
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return dateString;
    }
  };

  // Determinar o tipo de documento em português
  const getDocumentTypeLabel = (type) => {
    const types = {
      'medical': t('documents.types.medical'),
      'financial': t('documents.types.financial'),
      'budget': t('documents.types.budget'),
      'personal': t('documents.types.personal'),
      'legal': t('documents.types.legal'),
      'education': t('documents.types.education'),
      'work': t('documents.types.work'),
      'other': t('documents.types.other')
    };
    return types[type] || type;
  };

  // Renderizar campos específicos com base no tipo de documento
  const renderSpecificFields = () => {
    switch (documentData.documentType) {
      case 'medical':
        return (
          <>
            {documentData.doctorName && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('medical.consultations.doctor')}
                </h4>
                <div className="flex items-center">
                  <UserIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <p className="text-gray-900 dark:text-white">
                    {documentData.doctorName}
                    {documentData.doctorCRM && ` - CRM: ${documentData.doctorCRM}`}
                  </p>
                </div>
              </div>
            )}
            {documentData.doctorSpecialty && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('medical.consultations.specialty')}
                </h4>
                <p className="text-gray-900 dark:text-white">
                  {documentData.doctorSpecialty}
                </p>
              </div>
            )}
            {documentData.diagnosis && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('medical.consultations.diagnosis')}
                </h4>
                <p className="text-gray-900 dark:text-white">
                  {documentData.diagnosis}
                </p>
              </div>
            )}
          </>
        );
      case 'financial':
        return (
          <>
            {documentData.issuer && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('financial.issuer')}
                </h4>
                <p className="text-gray-900 dark:text-white">
                  {documentData.issuer}
                </p>
              </div>
            )}
            {documentData.totalAmount && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('financial.amount')}
                </h4>
                <p className="text-gray-900 dark:text-white">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(documentData.totalAmount)}
                </p>
              </div>
            )}
            {documentData.dueDate && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('financial.dueDate')}
                </h4>
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <p className="text-gray-900 dark:text-white">
                    {formatDate(documentData.dueDate)}
                  </p>
                </div>
              </div>
            )}
          </>
        );
      case 'budget':
        return (
          <>
            {documentData.supplier && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('budget.supplier')}
                </h4>
                <p className="text-gray-900 dark:text-white">
                  {documentData.supplier}
                </p>
              </div>
            )}
            {documentData.totalAmount && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('budget.amount')}
                </h4>
                <p className="text-gray-900 dark:text-white">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(documentData.totalAmount)}
                </p>
              </div>
            )}
            {documentData.validUntil && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('budget.validUntil')}
                </h4>
                <p className="text-gray-900 dark:text-white">
                  {formatDate(documentData.validUntil)}
                </p>
              </div>
            )}
          </>
        );
      default:
        return null;
    }
  };
  
  // Função para confirmar com a classificação selecionada
  const handleConfirm = () => {
    onConfirm({
      useAiClassification: hasClassificationMismatch ? useAiClassification : false
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col my-4">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Resultado da Extração
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        {/* Conteúdo com scroll */}
        <div className="p-6 overflow-y-auto flex-grow">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <DocumentTextIcon className="h-8 w-8 text-primary-500 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('documents.extraction_results')}
              </h3>
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {t('documents.extraction_description')}
            </p>
          </div>
          
          {/* Alerta de classificação inconsistente */}
          {hasClassificationMismatch && (
            <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Classificação Sugerida
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                    <p>
                      Você classificou este documento como <strong>{getDocumentTypeLabel(documentData.documentType)}</strong>, 
                      mas nossa IA sugere que seja <strong>{getDocumentTypeLabel(documentData.classificationMismatch.aiType)}</strong>.
                    </p>
                    <p className="mt-1">
                      Motivo: {documentData.classificationMismatch.reason}
                    </p>
                    <div className="mt-3">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio text-primary-600"
                          name="classification"
                          checked={useAiClassification}
                          onChange={() => setUseAiClassification(true)}
                        />
                        <span className="ml-2">Usar classificação sugerida pela IA</span>
                      </label>
                      <label className="inline-flex items-center ml-6">
                        <input
                          type="radio"
                          className="form-radio text-primary-600"
                          name="classification"
                          checked={!useAiClassification}
                          onChange={() => setUseAiClassification(false)}
                        />
                        <span className="ml-2">Manter minha classificação</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Informações básicas */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('documents.basic_info')}
            </h4>
            
            <div className="space-y-4">
              {/* Título */}
              <div>
                <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {t('documents.title')}
                </h5>
                <p className="text-sm text-gray-900 dark:text-white">
                  {documentData.title || t('common.not_available')}
                </p>
              </div>
              
              {/* Descrição */}
              <div>
                <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {t('documents.description')}
                </h5>
                <p className="text-sm text-gray-900 dark:text-white">
                  {documentData.description || t('common.not_available')}
                </p>
              </div>
              
              {/* Data */}
              <div>
                <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {t('documents.date')}
                </h5>
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 text-gray-500 mr-1" />
                  <p className="text-sm text-gray-900 dark:text-white">
                    {documentData.documentDate ? formatDate(documentData.documentDate) : t('common.not_available')}
                  </p>
                </div>
              </div>
              
              {/* Tipo */}
              <div>
                <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {t('documents.type')}
                </h5>
                <p className="text-sm text-gray-900 dark:text-white">
                  {getDocumentTypeLabel(documentData.documentType)}
                </p>
              </div>
            </div>
          </div>
          
          {/* Campos específicos por tipo de documento */}
          {renderSpecificFields()}
          
          {/* Texto extraído */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('documents.extracted_text')}
            </h4>
            <div className="mt-2 bg-gray-50 dark:bg-gray-700 rounded-md p-3 max-h-60 overflow-y-auto">
              {documentData.rawText && !documentData.rawText.startsWith('[') ? (
                <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap font-mono">
                  {documentData.rawText}
                </p>
              ) : documentData.rawText && documentData.rawText.startsWith('[') ? (
                <p className="text-sm text-yellow-600 dark:text-yellow-400 whitespace-pre-wrap">
                  {documentData.rawText}
                </p>
              ) : (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {t('common.no_text_extracted')}
                </p>
              )}
            </div>
          </div>
          
          {/* Insights da IA */}
          {(documentData.insights || documentData.aiAnalysis) && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                <InformationCircleIcon className="h-5 w-5 text-primary-500 mr-1" />
                Insights da IA
              </h4>
              <div className="mt-2 bg-primary-50 dark:bg-primary-900/30 rounded-md p-3 max-h-60 overflow-y-auto">
                {/* Resumo */}
                <div className="mb-3">
                  <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Resumo:
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {documentData.insights?.summary || 
                     documentData.aiAnalysis?.summary || 
                     "Não foi possível gerar um resumo para este documento."}
                  </p>
                </div>
                
                {/* Pontos de Atenção */}
                <div>
                  <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Pontos de Atenção:
                  </h5>
                  {documentData.insights?.pointsOfAttention || 
                   documentData.aiAnalysis?.pointsOfAttention ? (
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {typeof (documentData.insights?.pointsOfAttention || 
                              documentData.aiAnalysis?.pointsOfAttention) === 'string' ? (
                        <p>{documentData.insights?.pointsOfAttention || 
                            documentData.aiAnalysis?.pointsOfAttention}</p>
                      ) : (
                        <ul className="list-disc pl-5">
                          {Array.isArray(documentData.insights?.pointsOfAttention || 
                                        documentData.aiAnalysis?.pointsOfAttention) ? 
                            (documentData.insights?.pointsOfAttention || 
                             documentData.aiAnalysis?.pointsOfAttention).map((point, idx) => (
                              <li key={idx}>{point}</li>
                            )) : 
                            Object.entries(documentData.insights?.pointsOfAttention || 
                                          documentData.aiAnalysis?.pointsOfAttention).map(([key, value], idx) => (
                              <li key={idx}>{value}</li>
                            ))
                          }
                        </ul>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Não foram identificados pontos de atenção específicos.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Rodapé com botões */}
        <div className="flex justify-end space-x-3 p-4 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800 z-10">
          <button
            onClick={onReject}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <XCircleIcon className="h-5 w-5 inline-block mr-1 -mt-0.5" />
            {t('common.reject')}
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <CheckCircleIcon className="h-5 w-5 inline-block mr-1 -mt-0.5" />
            {t('common.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentConfirmationModal;
