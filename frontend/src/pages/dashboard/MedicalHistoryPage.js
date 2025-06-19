import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  HeartIcon, 
  DocumentTextIcon, 
  ClipboardDocumentCheckIcon, 
  DocumentChartBarIcon,
  ArrowUpTrayIcon,
  ChevronRightIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import api from '../../services/api';
import { toast } from 'react-toastify';
import medicalAnalysisService from '../../services/medicalAnalysisService';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const MedicalHistoryPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [medicalData, setMedicalData] = useState({
    summary: {
      totalDocuments: 0,
      consultations: 0,
      exams: 0,
      reports: 0,
      prescriptions: 0
    },
    lastConsultation: null,
    consultations: [],
    vitalSigns: {
      labels: [],
      datasets: []
    },
    labResults: {
      labels: [],
      datasets: []
    },
    documentsByType: {
      labels: [],
      datasets: []
    }
  });
  
  const [aiAnalysis, setAiAnalysis] = useState({
    vitalSigns: "Carregando análise...",
    labResults: "Carregando análise...",
    analysisDate: null
  });
  
  // Carregar dados médicos
  useEffect(() => {
    const fetchMedicalData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/medical/dashboard');
        const data = response.data.data;
        
        // Garantir que todos os objetos de gráfico tenham propriedades labels e datasets
        const safeData = {
          ...data,
          vitalSigns: data.vitalSigns || {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
            datasets: [
              {
                label: 'Pressão Sistólica',
                data: [120, 120, 120, 120, 120, 120],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                tension: 0.3
              },
              {
                label: 'Pressão Diastólica',
                data: [80, 80, 80, 80, 80, 80],
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                tension: 0.3
              }
            ]
          },
          labResults: data.labResults || {
            labels: ['Jan', 'Mar', 'Mai'],
            datasets: [
              {
                label: 'Glicose (mg/dL)',
                data: [95, 95, 95],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                tension: 0.3
              }
            ]
          },
          documentsByType: data.documentsByType || {
            labels: ['Consultas', 'Exames', 'Laudos', 'Receitas', 'Outros'],
            datasets: [
              {
                label: 'Documentos por Tipo',
                data: [0, 0, 0, 0, 0],
                backgroundColor: [
                  'rgba(255, 99, 132, 0.7)',
                  'rgba(54, 162, 235, 0.7)',
                  'rgba(255, 206, 86, 0.7)',
                  'rgba(75, 192, 192, 0.7)',
                  'rgba(153, 102, 255, 0.7)'
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
              }
            ]
          }
        };
        
        setMedicalData(safeData);
        
        // Obter análise de IA
        await fetchAIAnalysis(safeData);
      } catch (error) {
        console.error('Erro ao carregar dados médicos:', error);
        toast.error('Erro ao carregar dados médicos');
        
        // Dados de exemplo para desenvolvimento
        const mockData = {
          summary: {
            totalDocuments: 15,
            consultations: 6,
            exams: 4,
            reports: 3,
            prescriptions: 2
          },
          lastConsultation: {
            date: '2025-05-28T14:30:00Z',
            doctorName: 'Dra. Ana Silva',
            specialty: 'Cardiologia',
            doctorCRM: 'CRM/SP 123456',
            diagnosis: 'Hipertensão arterial leve'
          },
          consultations: [
            {
              id: '1',
              date: '2025-05-28T14:30:00Z',
              doctorName: 'Dra. Ana Silva',
              specialty: 'Cardiologia',
              diagnosis: 'Hipertensão arterial leve'
            },
            {
              id: '2',
              date: '2025-04-15T10:00:00Z',
              doctorName: 'Dr. Carlos Mendes',
              specialty: 'Clínica Geral',
              diagnosis: 'Infecção respiratória'
            },
            {
              id: '3',
              date: '2025-03-02T16:15:00Z',
              doctorName: 'Dr. Paulo Ribeiro',
              specialty: 'Ortopedia',
              diagnosis: 'Tendinite no ombro direito'
            }
          ],
          vitalSigns: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
            datasets: [
              {
                label: 'Pressão Sistólica',
                data: [120, 125, 123, 130, 128, 125],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                tension: 0.3
              },
              {
                label: 'Pressão Diastólica',
                data: [80, 82, 80, 85, 84, 82],
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                tension: 0.3
              }
            ]
          },
          labResults: {
            labels: ['Jan', 'Mar', 'Mai'],
            datasets: [
              {
                label: 'Glicose (mg/dL)',
                data: [95, 98, 92],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                tension: 0.3
              },
              {
                label: 'Colesterol Total (mg/dL)',
                data: [190, 185, 175],
                borderColor: 'rgb(153, 102, 255)',
                backgroundColor: 'rgba(153, 102, 255, 0.5)',
                tension: 0.3
              }
            ]
          },
          documentsByType: {
            labels: ['Consultas', 'Exames', 'Laudos', 'Receitas', 'Atestados'],
            datasets: [
              {
                label: 'Documentos por Tipo',
                data: [6, 4, 3, 2, 1],
                backgroundColor: [
                  'rgba(255, 99, 132, 0.7)',
                  'rgba(54, 162, 235, 0.7)',
                  'rgba(255, 206, 86, 0.7)',
                  'rgba(75, 192, 192, 0.7)',
                  'rgba(153, 102, 255, 0.7)'
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
              }
            ]
          }
        };
        
        setMedicalData(mockData);
        
        // Obter análise de IA para dados de exemplo
        await fetchAIAnalysis(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalData();
  }, []);

  // Obter análise de IA
  const fetchAIAnalysis = async (data) => {
    try {
      setAnalysisLoading(true);
      
      // Verificar se temos dados suficientes para análise
      if (!data || (!data.vitalSigns || !data.vitalSigns.datasets || data.vitalSigns.datasets.length === 0) && 
          (!data.labResults || !data.labResults.datasets || data.labResults.datasets.length === 0)) {
        setAiAnalysis({
          vitalSigns: "Não há dados suficientes para análise dos sinais vitais.",
          labResults: "Não há dados suficientes para análise dos resultados laboratoriais.",
          analysisDate: new Date().toISOString()
        });
        return;
      }
      
      // Obter análise médica usando o serviço
      const analysis = await medicalAnalysisService.getMedicalAnalysis({
        vitalSigns: data.vitalSigns,
        labResults: data.labResults
      });
      
      setAiAnalysis({
        vitalSigns: analysis.vitalSigns || "Não há análise disponível para este período.",
        labResults: analysis.labResults || "Não há análise disponível para este período.",
        analysisDate: analysis.analysisDate || new Date().toISOString()
      });
    } catch (error) {
      console.error('Erro ao obter análise de IA:', error);
      setAiAnalysis({
        vitalSigns: "Não foi possível gerar análise dos sinais vitais no momento.",
        labResults: "Não foi possível gerar análise dos resultados laboratoriais no momento.",
        analysisDate: new Date().toISOString()
      });
    } finally {
      setAnalysisLoading(false);
    }
  };

  // Forçar nova análise de IA
  const handleForceNewAnalysis = async () => {
    try {
      setAnalysisLoading(true);
      toast.info('Gerando nova análise...');
      
      // Forçar nova análise médica
      const analysis = await medicalAnalysisService.forceNewAnalysis({
        vitalSigns: medicalData.vitalSigns,
        labResults: medicalData.labResults
      });
      
      setAiAnalysis({
        vitalSigns: analysis.vitalSigns || "Não há análise disponível para este período.",
        labResults: analysis.labResults || "Não há análise disponível para este período.",
        analysisDate: analysis.analysisDate || new Date().toISOString()
      });
      
      toast.success('Nova análise gerada com sucesso!');
    } catch (error) {
      console.error('Erro ao forçar nova análise de IA:', error);
      toast.error('Erro ao gerar nova análise. Tente novamente mais tarde.');
    } finally {
      setAnalysisLoading(false);
    }
  };

  // Opções para gráficos
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      y: {
        beginAtZero: false,
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '70%'
  };

  // Formatar data
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return '';
    }
  };

  // Formatar hora
  const formatTime = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Erro ao formatar hora:', error);
      return '';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
            Histórico Médico
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Visualize e gerencie seus registros médicos, consultas e exames
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <>
          {/* Cards de resumo */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-6">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DocumentTextIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Total de Documentos
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900 dark:text-white">
                          {medicalData.summary.totalDocuments}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <HeartIcon className="h-6 w-6 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Consultas
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900 dark:text-white">
                          {medicalData.summary.consultations}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DocumentChartBarIcon className="h-6 w-6 text-blue-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Exames
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900 dark:text-white">
                          {medicalData.summary.exams}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ClipboardDocumentCheckIcon className="h-6 w-6 text-yellow-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Laudos
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900 dark:text-white">
                          {medicalData.summary.reports}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DocumentTextIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Receitas
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900 dark:text-white">
                          {medicalData.summary.prescriptions}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Última consulta */}
          {medicalData.lastConsultation && (
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-6">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Última Consulta
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                    Detalhes da sua consulta mais recente
                  </p>
                </div>
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {formatDate(medicalData.lastConsultation.date)}
                </span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700">
                <dl>
                  <div className="bg-gray-50 dark:bg-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">
                      Médico
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                      {medicalData.lastConsultation.doctorName}
                    </dd>
                  </div>
                  <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">
                      Especialidade
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                      {medicalData.lastConsultation.specialty}
                    </dd>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">
                      CRM
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                      {medicalData.lastConsultation.doctorCRM}
                    </dd>
                  </div>
                  <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">
                      Diagnóstico
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                      {medicalData.lastConsultation.diagnosis}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {/* Gráficos e análises */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
            {/* Gráfico de sinais vitais */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                Evolução de Sinais Vitais
              </h3>
              <div className="h-64">
                <Line options={lineOptions} data={medicalData.vitalSigns} />
              </div>
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Análise de IA
                  </h4>
                  <button
                    onClick={handleForceNewAnalysis}
                    disabled={analysisLoading}
                    className="inline-flex items-center p-1 border border-transparent rounded-full text-primary-600 hover:bg-primary-100 dark:text-primary-400 dark:hover:bg-primary-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    title="Atualizar análise"
                  >
                    <ArrowPathIcon className={`h-4 w-4 ${analysisLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {aiAnalysis.vitalSigns}
                </p>
                {aiAnalysis.analysisDate && (
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Análise gerada em: {formatDate(aiAnalysis.analysisDate)} às {formatTime(aiAnalysis.analysisDate)}
                  </p>
                )}
              </div>
            </div>

            {/* Gráfico de resultados laboratoriais */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                Evolução de Exames Laboratoriais
              </h3>
              <div className="h-64">
                <Line options={lineOptions} data={medicalData.labResults} />
              </div>
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Análise de IA
                  </h4>
                  <button
                    onClick={handleForceNewAnalysis}
                    disabled={analysisLoading}
                    className="inline-flex items-center p-1 border border-transparent rounded-full text-primary-600 hover:bg-primary-100 dark:text-primary-400 dark:hover:bg-primary-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    title="Atualizar análise"
                  >
                    <ArrowPathIcon className={`h-4 w-4 ${analysisLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {aiAnalysis.labResults}
                </p>
                {aiAnalysis.analysisDate && (
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Análise gerada em: {formatDate(aiAnalysis.analysisDate)} às {formatTime(aiAnalysis.analysisDate)}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
            {/* Gráfico de documentos por tipo */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                Documentos por Tipo
              </h3>
              <div className="h-64 flex items-center justify-center">
                <Doughnut options={doughnutOptions} data={medicalData.documentsByType} />
              </div>
            </div>

            {/* Lista de consultas recentes */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Consultas Recentes
                </h3>
                <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                  Ver todas
                </a>
              </div>
              <div className="overflow-hidden">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {medicalData.consultations && medicalData.consultations.length > 0 ? (
                    medicalData.consultations.map((consultation) => (
                      <li key={consultation.id} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                              <HeartIcon className="h-6 w-6" aria-hidden="true" />
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {consultation.doctorName}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {consultation.specialty} • {formatDate(consultation.date)} às {formatTime(consultation.date)}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {consultation.diagnosis}
                            </p>
                          </div>
                          <div>
                            <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="py-4 text-center text-gray-500 dark:text-gray-400">
                      Nenhuma consulta encontrada
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MedicalHistoryPage;
