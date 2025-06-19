/**
 * Controlador de Histórico Médico
 * 
 * Este controlador gerencia as operações relacionadas ao histórico médico.
 * 
 * @author Doc.AI Team
 */

const { MedicalRecord, Document, User } = require('../models');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

/**
 * Obtém dados do dashboard médico
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 */
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Buscar registros médicos do usuário
    const medicalRecords = await MedicalRecord.findAll({
      where: { userId },
      include: [
        {
          model: Document,
          as: 'document',
          attributes: ['id', 'title', 'description', 'createdAt']
        }
      ],
      order: [['recordDate', 'DESC']]
    });
    
    // Contar documentos por tipo
    const consultations = medicalRecords.filter(record => record.recordType === 'consulta').length;
    const exams = medicalRecords.filter(record => record.recordType === 'exame').length;
    const reports = medicalRecords.filter(record => record.recordType === 'laudo').length;
    const prescriptions = medicalRecords.filter(record => record.recordType === 'receituario' || record.recordType === 'prescricao').length;
    
    // Obter última consulta
    const lastConsultation = medicalRecords.find(record => record.recordType === 'consulta');
    
    // Preparar dados de sinais vitais para gráfico
    const vitalSignsData = prepareVitalSignsData(medicalRecords);
    
    // Preparar dados de exames laboratoriais para gráfico
    const labResultsData = prepareLabResultsData(medicalRecords);
    
    // Preparar dados de documentos por tipo para gráfico
    const documentsByTypeData = {
      labels: ['Consultas', 'Exames', 'Laudos', 'Receitas', 'Outros'],
      datasets: [
        {
          label: 'Documentos por Tipo',
          data: [consultations, exams, reports, prescriptions, medicalRecords.length - consultations - exams - reports - prescriptions],
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
    };
    
    // Preparar dados para o dashboard
    const dashboardData = {
      summary: {
        totalDocuments: medicalRecords.length,
        consultations,
        exams,
        reports,
        prescriptions
      },
      lastConsultation: lastConsultation ? {
        date: lastConsultation.recordDate,
        doctorName: lastConsultation.doctorName,
        specialty: lastConsultation.doctorSpecialty || lastConsultation.specialty,
        doctorCRM: lastConsultation.doctorCRM,
        diagnosis: lastConsultation.diagnosis
      } : null,
      consultations: medicalRecords
        .filter(record => record.recordType === 'consulta')
        .slice(0, 5)
        .map(record => ({
          id: record.id,
          date: record.recordDate,
          doctorName: record.doctorName,
          specialty: record.doctorSpecialty || record.specialty,
          diagnosis: record.diagnosis
        })),
      vitalSigns: vitalSignsData,
      labResults: labResultsData,
      documentsByType: documentsByTypeData
    };
    
    res.status(200).json({
      success: true,
      message: 'Dados do dashboard médico obtidos com sucesso',
      data: dashboardData
    });
  } catch (error) {
    logger.error('Erro ao obter dados do dashboard médico:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao obter dados do dashboard médico',
      error: error.message
    });
  }
};

/**
 * Prepara dados de sinais vitais para gráfico
 * @param {Array} records - Registros médicos
 * @returns {Object} - Dados formatados para gráfico
 */
function prepareVitalSignsData(records) {
  // Dados de exemplo para sinais vitais
  return {
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
  };
}

/**
 * Prepara dados de exames laboratoriais para gráfico
 * @param {Array} records - Registros médicos
 * @returns {Object} - Dados formatados para gráfico
 */
function prepareLabResultsData(records) {
  // Dados de exemplo para exames laboratoriais
  return {
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
  };
}
