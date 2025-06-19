/**
 * Utilitário para exportação de logs em PDF
 * 
 * Este arquivo contém funções para exportar logs do sistema em formato PDF.
 * 
 * @author Doc.AI Team
 */

// Importar jsPDF e o plugin AutoTable
import { jsPDF } from 'jspdf';
// Importar o plugin autotable diretamente
import autoTable from 'jspdf-autotable';

/**
 * Exporta logs para PDF
 * @param {Array} logs - Array de logs a serem exportados
 * @param {Object} filters - Filtros aplicados aos logs
 * @param {Object} pagination - Informações de paginação
 * @param {string} exportType - Tipo de exportação ('current', 'all', 'period')
 * @param {Object} period - Período de exportação (se exportType for 'period')
 */
export const exportLogsToPDF = async (logs, filters, pagination, exportType = 'current', period = null) => {
  try {
    // Criar novo documento PDF
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Adicionar cabeçalho com logo
    try {
      // Adicionar texto como logo
      doc.setFontSize(24);
      doc.setTextColor(37, 99, 235); // Cor azul do logo
      doc.setFont(undefined, 'bold');
      doc.text('Doc.AI', 15, 20);
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text('Sistema de Gerenciamento Inteligente de Documentos', 15, 25);
    } catch (error) {
      console.error('Erro ao adicionar logo:', error);
    }
    
    // Título do documento
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80); // Cor escura elegante
    doc.text('Relatório de Logs do Sistema', pageWidth / 2, 35, { align: 'center' });
    
    // Subtítulo com data e hora
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    const currentDate = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    doc.text(`Gerado em: ${currentDate}`, pageWidth / 2, 42, { align: 'center' });
    
    // Informações sobre os filtros
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    
    let yPosition = 55;
    
    // Adicionar informações sobre o tipo de exportação
    doc.setFont(undefined, 'bold');
    doc.text('Tipo de Exportação:', 15, yPosition);
    doc.setFont(undefined, 'normal');
    
    let exportTypeText = '';
    switch (exportType) {
      case 'current':
        exportTypeText = 'Página atual';
        break;
      case 'all':
        exportTypeText = 'Todos os logs';
        break;
      case 'period':
        exportTypeText = 'Período específico';
        break;
      default:
        exportTypeText = 'Personalizado';
    }
    
    doc.text(exportTypeText, 60, yPosition);
    yPosition += 7;
    
    // Adicionar informações sobre os filtros aplicados
    if (filters) {
      doc.setFont(undefined, 'bold');
      doc.text('Filtros Aplicados:', 15, yPosition);
      doc.setFont(undefined, 'normal');
      yPosition += 7;
      
      if (filters.type && filters.type !== 'all') {
        doc.text(`Tipo: ${filters.type}`, 20, yPosition);
        yPosition += 5;
      }
      
      if (filters.level && filters.level !== 'all') {
        doc.text(`Nível: ${filters.level}`, 20, yPosition);
        yPosition += 5;
      }
      
      if (filters.search) {
        doc.text(`Busca: "${filters.search}"`, 20, yPosition);
        yPosition += 5;
      }
      
      if (period && exportType === 'period') {
        const startDate = new Date(period.startDate).toLocaleDateString('pt-BR');
        const endDate = new Date(period.endDate).toLocaleDateString('pt-BR');
        doc.text(`Período: ${startDate} até ${endDate}`, 20, yPosition);
        yPosition += 5;
      }
      
      yPosition += 2;
    }
    
    // Adicionar informações sobre a paginação
    if (pagination && exportType === 'current') {
      doc.text(`Página ${pagination.page} de ${pagination.pages} (${pagination.total} logs no total)`, 15, yPosition);
      yPosition += 10;
    } else {
      doc.text(`Total de logs: ${logs.length}`, 15, yPosition);
      yPosition += 10;
    }
    
    // Adicionar tabela de logs
    const tableColumn = ['Data/Hora', 'Tipo', 'Nível', 'Mensagem', 'Usuário'];
    
    // Preparar dados para a tabela
    const tableRows = logs.map(log => {
      const timestamp = new Date(log.timestamp).toLocaleString('pt-BR');
      const userName = log.user ? log.user.name : '-';
      
      return [
        timestamp,
        log.type,
        log.level,
        log.message,
        userName
      ];
    });
    
    // Definir cores para os níveis de log
    const levelColors = {
      info: [0, 128, 255],    // Azul
      warning: [255, 153, 0],  // Laranja
      error: [255, 51, 51]     // Vermelho
    };
    
    try {
      // Usar o plugin autoTable diretamente
      autoTable(doc, {
        startY: yPosition,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        headStyles: {
          fillColor: [52, 73, 94],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240]
        },
        columnStyles: {
          0: { cellWidth: 40 },  // Data/Hora
          1: { cellWidth: 25 },  // Tipo
          2: { cellWidth: 20 },  // Nível
          3: { cellWidth: 'auto' }, // Mensagem (automático)
          4: { cellWidth: 30 }   // Usuário
        },
        // Estilizar células com base no nível do log
        didDrawCell: (data) => {
          if (data.section === 'body' && data.column.index === 2) {
            const level = tableRows[data.row.index][2];
            if (levelColors[level]) {
              doc.setTextColor(levelColors[level][0], levelColors[level][1], levelColors[level][2]);
            }
          }
        }
      });
    } catch (error) {
      console.error('Erro ao criar tabela:', error);
      // Adicionar texto alternativo se a tabela falhar
      doc.text('Não foi possível gerar a tabela de logs. Erro: ' + error.message, 15, yPosition + 10);
    }
    
    // Adicionar rodapé
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      
      // Linha de separação
      doc.setDrawColor(200, 200, 200);
      doc.line(15, doc.internal.pageSize.getHeight() - 20, pageWidth - 15, doc.internal.pageSize.getHeight() - 20);
      
      // Texto do rodapé
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('Doc.AI - Sistema de Gerenciamento Inteligente de Documentos Pessoais', pageWidth / 2, doc.internal.pageSize.getHeight() - 15, { align: 'center' });
      doc.text(`Página ${i} de ${totalPages}`, pageWidth - 15, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
      doc.text('Confidencial - Uso Interno', 15, doc.internal.pageSize.getHeight() - 10);
    }
    
    // Salvar o PDF
    const fileName = `docai_logs_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    
    return fileName;
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw error;
  }
};

/**
 * Exporta logs do período atual
 * @param {Array} logs - Array de logs a serem exportados
 * @param {Object} filters - Filtros aplicados aos logs
 * @param {Object} pagination - Informações de paginação
 */
export const exportCurrentLogs = async (logs, filters, pagination) => {
  try {
    return await exportLogsToPDF(logs, filters, pagination, 'current');
  } catch (error) {
    console.error('Erro ao exportar logs atuais:', error);
    throw error;
  }
};

/**
 * Exporta todos os logs
 * @param {Array} logs - Array de logs a serem exportados
 * @param {Object} filters - Filtros aplicados aos logs
 */
export const exportAllLogs = async (logs, filters) => {
  try {
    return await exportLogsToPDF(logs, filters, null, 'all');
  } catch (error) {
    console.error('Erro ao exportar todos os logs:', error);
    throw error;
  }
};

/**
 * Exporta logs de um período específico
 * @param {Array} logs - Array de logs a serem exportados
 * @param {Object} filters - Filtros aplicados aos logs
 * @param {Object} period - Período de exportação (startDate, endDate)
 */
export const exportLogsByPeriod = async (logs, filters, period) => {
  try {
    return await exportLogsToPDF(logs, filters, null, 'period', period);
  } catch (error) {
    console.error('Erro ao exportar logs por período:', error);
    throw error;
  }
};
