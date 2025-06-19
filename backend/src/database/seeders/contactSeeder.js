/**
 * Seeder de Contatos
 * 
 * Este arquivo cria contatos fictícios para testes.
 * 
 * @author Doc.AI Team
 */

const { Contact, User } = require('../../models');
const logger = require('../../utils/logger');

const createContacts = async () => {
  try {
    // Obter usuário administrador para atribuir contatos
    const admin = await User.findOne({ where: { role: 'admin' } });

    // Criar contatos fictícios
    const contacts = [
      {
        name: 'Ricardo Souza',
        email: 'ricardo@exemplo.com',
        phone: '(11) 98765-4321',
        subject: 'Dúvida sobre planos',
        message: 'Olá, gostaria de saber mais detalhes sobre o plano Profissional. Ele permite compartilhar documentos com outras pessoas?',
        status: 'resolved',
        assignedTo: admin.id,
        notes: 'Cliente respondido por email com detalhes do plano e confirmação sobre o compartilhamento de documentos.',
        resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 dias atrás
      },
      {
        name: 'Amanda Ferreira',
        email: 'amanda@exemplo.com',
        phone: '(21) 99876-5432',
        subject: 'Problema com upload de documentos',
        message: 'Estou tentando fazer upload de um documento PDF, mas está dando erro. O arquivo tem 8MB.',
        status: 'in_progress',
        assignedTo: admin.id,
        notes: 'Solicitei mais informações sobre o navegador e sistema operacional utilizados.'
      },
      {
        name: 'Marcelo Alves',
        email: 'marcelo@exemplo.com',
        phone: '(31) 97654-3210',
        subject: 'Solicitação de funcionalidade',
        message: 'Seria possível adicionar uma função para assinar documentos digitalmente diretamente na plataforma?',
        status: 'new'
      },
      {
        name: 'Juliana Martins',
        email: 'juliana@exemplo.com',
        phone: '(41) 98877-6655',
        subject: 'Dúvida sobre segurança',
        message: 'Quais são as medidas de segurança implementadas para proteger meus documentos? Vocês estão em conformidade com a LGPD?',
        status: 'new'
      },
      {
        name: 'Eduardo Santos',
        email: 'eduardo@exemplo.com',
        phone: '(51) 96543-2109',
        subject: 'Problema com pagamento',
        message: 'Fiz o pagamento do plano Empresarial via PIX há 2 dias, mas minha conta ainda não foi atualizada.',
        status: 'in_progress',
        assignedTo: admin.id,
        notes: 'Verificando com o setor financeiro. Solicitei comprovante de pagamento.'
      }
    ];

    for (const contact of contacts) {
      await Contact.create(contact);
    }

    logger.info('Contatos criados com sucesso!');
  } catch (error) {
    logger.error('Erro ao criar contatos:', error);
  }
};

module.exports = createContacts;
