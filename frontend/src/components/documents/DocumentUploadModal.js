import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  XMarkIcon,
  DocumentIcon,
  CameraIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline';
import { isMobileDevice, hasCamera } from '../../utils/deviceDetector';
import api from '../../services/api';
import { toast } from 'react-toastify';
import DocumentConfirmationModal from './DocumentConfirmationModal';

const DocumentUploadModal = ({ isOpen, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [documentType, setDocumentType] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [hasDeviceCamera, setHasDeviceCamera] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Tipos de documentos disponíveis
  const documentTypes = [
    { value: 'medical', label: t('documents.types.medical') },
    { value: 'financial', label: t('documents.types.financial') },
    { value: 'budget', label: t('documents.types.budget') },
    { value: 'personal', label: t('documents.types.personal') },
    { value: 'other', label: t('documents.types.other') }
  ];

  // Detectar tipo de dispositivo e disponibilidade de câmera
  useEffect(() => {
    const checkDevice = async () => {
      const mobile = isMobileDevice();
      setIsMobile(mobile);
      
      if (mobile) {
        const camera = await hasCamera();
        setHasDeviceCamera(camera);
      }
    };
    
    checkDevice();
  }, []);

  // Limpar stream da câmera ao fechar o modal
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Iniciar câmera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      setShowCamera(true);
    } catch (error) {
      console.error('Erro ao acessar câmera:', error);
      toast.error(t('documents.camera_error'));
      setHasDeviceCamera(false);
    }
  };

  // Capturar foto da câmera
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Definir dimensões do canvas para corresponder ao vídeo
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Desenhar frame atual do vídeo no canvas
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Converter canvas para blob
    canvas.toBlob(blob => {
      // Criar arquivo a partir do blob
      const capturedFile = new File([blob], 'camera_capture.jpg', { type: 'image/jpeg' });
      setFile(capturedFile);
      
      // Criar URL para preview
      const previewUrl = URL.createObjectURL(blob);
      setPreview(previewUrl);
      
      // Parar câmera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      setShowCamera(false);
    }, 'image/jpeg', 0.95);
  };

  // Cancelar câmera
  const cancelCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  // Manipular seleção de arquivo
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) return;
    
    // Verificar tamanho do arquivo (10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error(t('documents.file_too_large'));
      return;
    }
    
    // Verificar tipo de arquivo
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
    if (!validTypes.includes(selectedFile.type)) {
      toast.error(t('documents.invalid_file_type'));
      return;
    }
    
    setFile(selectedFile);
    
    // Criar preview para imagens
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      // Para PDFs e outros tipos, mostrar ícone genérico
      setPreview(null);
    }
  };

  // Abrir seletor de arquivo
  const openFilePicker = () => {
    fileInputRef.current.click();
  };

  // Processar documento
  const handleUpload = async () => {
    if (!documentType) {
      toast.error(t('documents.select_type'));
      return;
    }
    
    if (!file) {
      toast.error(t('documents.select_file'));
      return;
    }
    
    setUploading(true);
    setProcessing(true);
    setProgress(0);
    
    // Mostrar mensagem de processamento
    toast.info(t('documents.processing_message') || 'Processando documento. Isso pode levar até 1 minuto...', {
      autoClose: false,
      toastId: 'processing-document'
    });
    
    try {
      // Criar FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);
      
      // Configurar request com progresso e timeout aumentado
      const response = await api.post('/documents/process', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
        timeout: 120000 // 2 minutos
      });
      
      setUploading(false);
      
      // Fechar o toast de processamento
      toast.dismiss('processing-document');
      
      if (response.data.success) {
        // Mostrar modal de confirmação com os dados extraídos
        setExtractedData({
          ...response.data.data.analysisResult,
          documentType,
          rawText: response.data.data.extractedText,
          recordId: response.data.data.recordId,
          classificationMismatch: response.data.data.classificationMismatch
        });
        setShowConfirmation(true);
      } else {
        toast.error(response.data.message || t('documents.upload_error'));
        setProcessing(false);
      }
    } catch (error) {
      console.error('Erro ao enviar documento:', error);
      
      // Fechar o toast de processamento
      toast.dismiss('processing-document');
      
      // Mostrar mensagem de erro específica
      if (error.code === 'ECONNABORTED') {
        toast.error('O processamento do documento está demorando muito. Por favor, tente novamente com um documento menor ou mais simples.');
      } else {
        toast.error(t('documents.upload_error'));
      }
      
      setUploading(false);
      setProcessing(false);
    }
  };

  // Confirmar processamento do documento
  const handleConfirmDocument = async (options = {}) => {
    try {
      // Enviar confirmação para o backend
      const response = await api.post('/documents/confirm', {
        recordId: extractedData.recordId,
        documentType,
        useAiClassification: options.useAiClassification || false
      });
      
      if (response.data.success) {
        toast.success(t('documents.confirmation_success'));
        setShowConfirmation(false);
        setProcessing(false);
        
        // Chamar callback de sucesso
        if (onSuccess) {
          onSuccess(response.data.data);
        }
        
        // Fechar modal
        handleClose();
      } else {
        toast.error(response.data.message || t('documents.confirmation_error'));
      }
    } catch (error) {
      console.error('Erro ao confirmar documento:', error);
      toast.error(t('documents.confirmation_error'));
    }
  };

  // Rejeitar processamento do documento
  const handleRejectDocument = async () => {
    try {
      // Enviar rejeição para o backend
      const response = await api.post('/documents/reject', {
        recordId: extractedData.recordId
      });
      
      if (response.data.success) {
        toast.info(t('documents.rejection_success'));
      } else {
        toast.error(response.data.message || t('documents.rejection_error'));
      }
    } catch (error) {
      console.error('Erro ao rejeitar documento:', error);
      toast.error(t('documents.rejection_error'));
    } finally {
      setShowConfirmation(false);
      setProcessing(false);
    }
  };

  // Limpar e fechar modal
  const handleClose = () => {
    if (processing) {
      // Confirmar antes de fechar se estiver processando
      if (!window.confirm(t('documents.close_confirmation'))) {
        return;
      }
    }
    
    setDocumentType('');
    setFile(null);
    setPreview(null);
    setProgress(0);
    setShowCamera(false);
    setShowConfirmation(false);
    setProcessing(false);
    setExtractedData(null);
    
    // Parar câmera se estiver ativa
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    onClose();
  };

  // Se o modal não estiver aberto, não renderizar nada
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
          {/* Cabeçalho */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('documents.upload_document')}
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          {/* Conteúdo */}
          <div className="p-4">
            {/* Seleção de tipo de documento */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('documents.document_type')}
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                disabled={uploading || processing}
              >
                <option value="">{t('documents.select_type')}</option>
                {documentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Área de upload */}
            {!showCamera ? (
              <div className="mb-4">
                {file ? (
                  <div className="border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg p-4 text-center">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="max-h-48 mx-auto mb-2"
                      />
                    ) : (
                      <DocumentIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {file.name} ({(file.size / 1024).toFixed(2)} KB)
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        setPreview(null);
                      }}
                      className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      disabled={uploading || processing}
                    >
                      {t('documents.remove')}
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg p-6 text-center">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*,application/pdf,text/plain"
                      disabled={uploading || processing}
                    />
                    <DocumentIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {t('documents.drag_or_click')}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-2">
                      <button
                        type="button"
                        onClick={openFilePicker}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        disabled={uploading || processing}
                      >
                        <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
                        {t('documents.select_file')}
                      </button>
                      
                      {isMobile && hasDeviceCamera && (
                        <button
                          type="button"
                          onClick={startCamera}
                          className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                          disabled={uploading || processing}
                        >
                          <CameraIcon className="h-5 w-5 mr-2" />
                          {t('documents.use_camera')}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="mb-4">
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full rounded-lg"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <CameraIcon className="h-5 w-5 mr-2" />
                      {t('documents.capture')}
                    </button>
                    
                    <button
                      type="button"
                      onClick={cancelCamera}
                      className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <XMarkIcon className="h-5 w-5 mr-2" />
                      {t('documents.cancel')}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Barra de progresso */}
            {uploading && (
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className="bg-primary-600 h-2.5 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-center">
                  {progress}%
                </p>
              </div>
            )}
            
            {/* Mensagem de processamento */}
            {processing && !uploading && (
              <div className="mb-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500 mx-auto mb-2"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('documents.processing')}
                </p>
              </div>
            )}
          </div>
          
          {/* Rodapé */}
          <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleClose}
              className="mr-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              disabled={uploading}
            >
              {t('common.cancel')}
            </button>
            
            <button
              type="button"
              onClick={handleUpload}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              disabled={uploading || processing || !file || !documentType}
            >
              {uploading ? t('documents.uploading') : t('documents.upload')}
            </button>
          </div>
        </div>
      </div>
      
      {/* Modal de confirmação */}
      {showConfirmation && extractedData && (
        <DocumentConfirmationModal
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          documentData={extractedData}
          onConfirm={handleConfirmDocument}
          onReject={handleRejectDocument}
        />
      )}
    </>
  );
};

export default DocumentUploadModal;
