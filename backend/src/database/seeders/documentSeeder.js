/**
 * Seeder de Documentos
 * 
 * Este arquivo cria documentos fictícios para testes.
 * 
 * @author Doc.AI Team
 */

const fs = require('fs');
const path = require('path');
const { Document, User } = require('../../models');
const logger = require('../../utils/logger');

const createDocuments = async () => {
  try {
    // Criar diretório de uploads se não existir
    const uploadsDir = path.join(__dirname, '../../../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Obter usuários para associar aos documentos
    const users = await User.findAll({ where: { role: 'user' } });
    
    // Criar documentos fictícios para cada usuário
    for (const user of users) {
      // Criar diretório do usuário
      const userDir = path.join(uploadsDir, user.id);
      if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true });
      }

      // Documentos para o usuário atual
      const userDocuments = [];

      // Documentos de saúde
      if (Math.random() > 0.3) { // 70% de chance de ter documentos de saúde
        userDocuments.push(
          {
            userId: user.id,
            title: 'Exame de Sangue',
            description: 'Exame de sangue completo realizado em 01/06/2025',
            category: 'saude',
            tags: ['exame', 'sangue', 'hemograma'],
            filePath: `${user.id}/exame_sangue.pdf`,
            fileType: 'pdf',
            fileSize: 1024 * 1024, // 1MB
            contentText: 'Resultado de exame de sangue: Hemoglobina: 14.5 g/dL, Glicose: 95 mg/dL, Colesterol total: 180 mg/dL...',
            aiProcessed: true,
            aiSummary: 'Exame de sangue com resultados dentro dos parâmetros normais. Níveis de glicose, colesterol e triglicerídeos adequados.',
            aiEntities: {
              hemoglobina: '14.5 g/dL',
              glicose: '95 mg/dL',
              colesterol: '180 mg/dL'
            },
            aiCategories: ['exame', 'sangue', 'rotina'],
            aiSentiment: 'neutral',
            isPublic: false,
            viewCount: Math.floor(Math.random() * 10),
            lastViewed: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
          },
          {
            userId: user.id,
            title: 'Receita Médica',
            description: 'Receita de medicamentos para tratamento de alergia',
            category: 'saude',
            tags: ['receita', 'alergia', 'medicamento'],
            filePath: `${user.id}/receita_medica.pdf`,
            fileType: 'pdf',
            fileSize: 512 * 1024, // 512KB
            contentText: 'Receita médica: Loratadina 10mg, tomar 1 comprimido por dia durante 7 dias...',
            aiProcessed: true,
            aiSummary: 'Receita para tratamento de alergia com Loratadina 10mg por 7 dias.',
            aiEntities: {
              medicamento: 'Loratadina 10mg',
              posologia: '1 comprimido por dia',
              duracao: '7 dias'
            },
            aiCategories: ['receita', 'alergia', 'medicamento'],
            aiSentiment: 'neutral',
            isPublic: false,
            viewCount: Math.floor(Math.random() * 5),
            lastViewed: new Date(Date.now() - Math.floor(Math.random() * 15) * 24 * 60 * 60 * 1000)
          }
        );
      }

      // Documentos financeiros
      if (Math.random() > 0.4) { // 60% de chance de ter documentos financeiros
        userDocuments.push(
          {
            userId: user.id,
            title: 'Extrato Bancário',
            description: 'Extrato bancário do mês de maio de 2025',
            category: 'financeiro',
            tags: ['extrato', 'banco', 'finanças'],
            filePath: `${user.id}/extrato_bancario.pdf`,
            fileType: 'pdf',
            fileSize: 768 * 1024, // 768KB
            contentText: 'Extrato bancário: Saldo anterior: R$ 5.230,45, Depósitos: R$ 3.500,00, Saques: R$ 1.200,00, Saldo atual: R$ 7.530,45...',
            aiProcessed: true,
            aiSummary: 'Extrato bancário de maio/2025 com saldo positivo de R$ 7.530,45. Principais movimentações incluem depósito de salário e pagamentos de contas.',
            aiEntities: {
              saldo_anterior: 'R$ 5.230,45',
              depositos: 'R$ 3.500,00',
              saques: 'R$ 1.200,00',
              saldo_atual: 'R$ 7.530,45'
            },
            aiCategories: ['extrato', 'banco', 'finanças'],
            aiSentiment: 'positive',
            isPublic: false,
            viewCount: Math.floor(Math.random() * 8),
            lastViewed: new Date(Date.now() - Math.floor(Math.random() * 20) * 24 * 60 * 60 * 1000)
          },
          {
            userId: user.id,
            title: 'Declaração de Imposto de Renda',
            description: 'Declaração de IR do ano-calendário 2024',
            category: 'financeiro',
            tags: ['imposto', 'IR', 'declaração'],
            filePath: `${user.id}/ir_2024.pdf`,
            fileType: 'pdf',
            fileSize: 1500000, // 1.5MB
            contentText: 'Declaração de Imposto de Renda Pessoa Física - Ano-calendário 2024. Rendimentos tributáveis: R$ 85.000,00...',
            aiProcessed: true,
            aiSummary: 'Declaração de IR 2024 com rendimentos tributáveis de R$ 85.000,00 e imposto a pagar de R$ 3.200,00.',
            aiEntities: {
              rendimentos: 'R$ 85.000,00',
              imposto_pagar: 'R$ 3.200,00',
              ano_calendario: '2024'
            },
            aiCategories: ['imposto', 'IR', 'declaração'],
            aiSentiment: 'neutral',
            isPublic: false,
            viewCount: Math.floor(Math.random() * 3),
            lastViewed: new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000)
          }
        );
      }

      // Documentos jurídicos
      if (Math.random() > 0.5) { // 50% de chance de ter documentos jurídicos
        userDocuments.push(
          {
            userId: user.id,
            title: 'Contrato de Aluguel',
            description: 'Contrato de locação de imóvel residencial',
            category: 'juridico',
            tags: ['contrato', 'aluguel', 'imóvel'],
            filePath: `${user.id}/contrato_aluguel.pdf`,
            fileType: 'pdf',
            fileSize: 2000000, // 2MB
            contentText: 'Contrato de Locação de Imóvel Residencial. Locador: João Silva, Locatário: Maria Souza. Valor mensal: R$ 2.500,00...',
            aiProcessed: true,
            aiSummary: 'Contrato de aluguel com valor mensal de R$ 2.500,00, duração de 30 meses e multa por rescisão de 3 aluguéis.',
            aiEntities: {
              locador: 'João Silva',
              locatario: 'Maria Souza',
              valor: 'R$ 2.500,00',
              duracao: '30 meses'
            },
            aiCategories: ['contrato', 'aluguel', 'imóvel'],
            aiSentiment: 'neutral',
            isPublic: false,
            viewCount: Math.floor(Math.random() * 12),
            lastViewed: new Date(Date.now() - Math.floor(Math.random() * 45) * 24 * 60 * 60 * 1000)
          }
        );
      }

      // Documentos pessoais
      if (Math.random() > 0.2) { // 80% de chance de ter documentos pessoais
        userDocuments.push(
          {
            userId: user.id,
            title: 'RG e CPF',
            description: 'Cópias digitalizadas de documentos pessoais',
            category: 'pessoal',
            tags: ['RG', 'CPF', 'documento'],
            filePath: `${user.id}/documentos_pessoais.pdf`,
            fileType: 'pdf',
            fileSize: 1200000, // 1.2MB
            contentText: 'Documentos pessoais: RG 12.345.678-9, CPF 123.456.789-00...',
            aiProcessed: true,
            aiSummary: 'Cópias digitalizadas de RG e CPF em bom estado.',
            aiEntities: {
              rg: '12.345.678-9',
              cpf: '123.456.789-00',
              nome: user.name
            },
            aiCategories: ['documento', 'identificação', 'pessoal'],
            aiSentiment: 'neutral',
            isPublic: false,
            viewCount: Math.floor(Math.random() * 6),
            lastViewed: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000)
          }
        );
      }

      // Documentos educacionais
      if (Math.random() > 0.6) { // 40% de chance de ter documentos educacionais
        userDocuments.push(
          {
            userId: user.id,
            title: 'Diploma Universitário',
            description: 'Diploma de conclusão do curso de Engenharia',
            category: 'educacao',
            tags: ['diploma', 'universidade', 'engenharia'],
            filePath: `${user.id}/diploma.pdf`,
            fileType: 'pdf',
            fileSize: 3000000, // 3MB
            contentText: 'Diploma de Bacharel em Engenharia Civil conferido a ' + user.name + '...',
            aiProcessed: true,
            aiSummary: 'Diploma de Bacharel em Engenharia Civil pela Universidade Federal, concluído em 2020 com nota média 8.5.',
            aiEntities: {
              curso: 'Engenharia Civil',
              instituicao: 'Universidade Federal',
              ano: '2020',
              nota: '8.5'
            },
            aiCategories: ['diploma', 'educação', 'engenharia'],
            aiSentiment: 'positive',
            isPublic: false,
            viewCount: Math.floor(Math.random() * 4),
            lastViewed: new Date(Date.now() - Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000)
          }
        );
      }

      // Criar arquivos fictícios
      for (const doc of userDocuments) {
        const filePath = path.join(userDir, path.basename(doc.filePath));
        fs.writeFileSync(filePath, `Conteúdo fictício para ${doc.title}`);
        
        // Criar registro no banco de dados
        await Document.create(doc);
      }
    }

    logger.info('Documentos criados com sucesso!');
  } catch (error) {
    logger.error('Erro ao criar documentos:', error);
  }
};

module.exports = createDocuments;
