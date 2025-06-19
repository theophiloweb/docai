/**
 * Seeder de Planos
 * 
 * Este arquivo cria planos fictícios para testes.
 * 
 * @author Doc.AI Team
 */

const { Plan } = require('../../models');
const logger = require('../../utils/logger');

const createPlans = async () => {
  try {
    const plans = [
      {
        name: 'Gratuito',
        description: 'Plano básico para experimentar a plataforma.',
        price: 0.00,
        billingCycle: 'monthly',
        features: [
          'Até 5 documentos',
          'Armazenamento de 100MB',
          '3 análises de IA por mês',
          'Suporte por email'
        ],
        storageLimit: 100,
        documentLimit: 5,
        aiAnalysisLimit: 3,
        isPopular: false,
        isActive: true,
        displayOrder: 1
      },
      {
        name: 'Básico',
        description: 'Ideal para uso pessoal com recursos essenciais.',
        price: 29.90,
        billingCycle: 'monthly',
        features: [
          'Até 50 documentos',
          'Armazenamento de 1GB',
          '20 análises de IA por mês',
          'Suporte por email e chat',
          'Exportação de documentos'
        ],
        storageLimit: 1024,
        documentLimit: 50,
        aiAnalysisLimit: 20,
        isPopular: false,
        isActive: true,
        displayOrder: 2
      },
      {
        name: 'Profissional',
        description: 'Perfeito para profissionais que precisam gerenciar muitos documentos.',
        price: 59.90,
        billingCycle: 'monthly',
        features: [
          'Documentos ilimitados',
          'Armazenamento de 10GB',
          '100 análises de IA por mês',
          'Suporte prioritário',
          'Exportação de documentos',
          'Compartilhamento seguro',
          'Análises avançadas'
        ],
        storageLimit: 10240,
        documentLimit: -1, // ilimitado
        aiAnalysisLimit: 100,
        isPopular: true,
        isActive: true,
        displayOrder: 3
      },
      {
        name: 'Empresarial',
        description: 'Solução completa para empresas com recursos avançados de segurança e colaboração.',
        price: 149.90,
        billingCycle: 'monthly',
        features: [
          'Documentos ilimitados',
          'Armazenamento de 50GB',
          'Análises de IA ilimitadas',
          'Suporte VIP 24/7',
          'Exportação de documentos',
          'Compartilhamento seguro',
          'Análises avançadas',
          'Integração com sistemas empresariais',
          'Painel administrativo',
          'Usuários múltiplos'
        ],
        storageLimit: 51200,
        documentLimit: -1, // ilimitado
        aiAnalysisLimit: -1, // ilimitado
        isPopular: false,
        isActive: true,
        displayOrder: 4
      },
      {
        name: 'Familiar',
        description: 'Compartilhe o acesso com até 5 membros da família.',
        price: 89.90,
        billingCycle: 'monthly',
        features: [
          'Até 5 usuários',
          'Documentos ilimitados',
          'Armazenamento de 20GB',
          '200 análises de IA por mês',
          'Suporte prioritário',
          'Compartilhamento entre membros',
          'Controle parental'
        ],
        storageLimit: 20480,
        documentLimit: -1, // ilimitado
        aiAnalysisLimit: 200,
        isPopular: false,
        isActive: true,
        displayOrder: 5
      }
    ];

    for (const plan of plans) {
      await Plan.create(plan);
    }

    logger.info('Planos criados com sucesso!');
  } catch (error) {
    logger.error('Erro ao criar planos:', error);
  }
};

module.exports = createPlans;
