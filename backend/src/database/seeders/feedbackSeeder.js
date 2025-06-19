/**
 * Seeder de Feedbacks
 * 
 * Este arquivo cria feedbacks fictícios para testes.
 * 
 * @author Doc.AI Team
 */

const { Feedback, User } = require('../../models');
const logger = require('../../utils/logger');

const createFeedbacks = async () => {
  try {
    // Obter alguns usuários para associar aos feedbacks
    const users = await User.findAll({ where: { role: 'user' }, limit: 3 });

    // Criar feedbacks fictícios
    const feedbacks = [
      {
        userId: users[0].id,
        name: users[0].name,
        email: users[0].email,
        rating: 5,
        comment: 'O Doc.AI revolucionou a forma como gerencio meus documentos médicos. A interface é intuitiva e as análises de IA são extremamente úteis para entender meus exames.',
        position: 'Médico',
        company: 'Hospital Central',
        isApproved: true,
        isDisplayed: true,
        displayOrder: 1
      },
      {
        userId: users[1].id,
        name: users[1].name,
        email: users[1].email,
        rating: 4,
        comment: 'Excelente ferramenta para organizar documentos importantes. A função de busca é muito eficiente e economiza muito tempo.',
        position: 'Advogada',
        company: 'Escritório Jurídico Silva & Associados',
        isApproved: true,
        isDisplayed: true,
        displayOrder: 2
      },
      {
        userId: users[2].id,
        name: users[2].name,
        email: users[2].email,
        rating: 5,
        comment: 'Como contador, preciso manter documentos organizados e seguros. O Doc.AI atende perfeitamente às minhas necessidades com seu sistema de categorização inteligente.',
        position: 'Contador',
        company: 'Contabilidade Express',
        isApproved: true,
        isDisplayed: true,
        displayOrder: 3
      },
      {
        name: 'Roberto Almeida',
        email: 'roberto@exemplo.com',
        rating: 5,
        comment: 'Fantástico! Consigo acessar meus documentos de qualquer lugar e a segurança me dá muita tranquilidade.',
        position: 'Empresário',
        company: 'Tech Solutions',
        isApproved: true,
        isDisplayed: true,
        displayOrder: 4
      },
      {
        name: 'Camila Rodrigues',
        email: 'camila@exemplo.com',
        rating: 4,
        comment: 'A função de análise de documentos médicos é impressionante. Ajudou-me a entender melhor meus exames sem precisar consultar um médico para cada dúvida simples.',
        position: 'Professora',
        company: 'Escola Municipal',
        isApproved: true,
        isDisplayed: true,
        displayOrder: 5
      },
      {
        name: 'Paulo Mendes',
        email: 'paulo@exemplo.com',
        rating: 5,
        comment: 'O suporte ao cliente é excepcional. Tive um problema com o upload de um documento e a equipe resolveu em minutos.',
        position: 'Engenheiro',
        company: 'Construtora Nacional',
        isApproved: true,
        isDisplayed: true,
        displayOrder: 6
      },
      {
        name: 'Luciana Costa',
        email: 'luciana@exemplo.com',
        rating: 3,
        comment: 'Bom serviço, mas poderia ter mais opções de categorização de documentos.',
        position: 'Arquiteta',
        company: 'Estúdio de Arquitetura',
        isApproved: true,
        isDisplayed: false
      },
      {
        name: 'Fernando Gomes',
        email: 'fernando@exemplo.com',
        rating: 2,
        comment: 'Tive alguns problemas com a velocidade do sistema. Às vezes demora para carregar documentos grandes.',
        position: 'Designer',
        company: 'Agência Criativa',
        isApproved: false,
        isDisplayed: false
      }
    ];

    for (const feedback of feedbacks) {
      await Feedback.create(feedback);
    }

    logger.info('Feedbacks criados com sucesso!');
  } catch (error) {
    logger.error('Erro ao criar feedbacks:', error);
  }
};

module.exports = createFeedbacks;
