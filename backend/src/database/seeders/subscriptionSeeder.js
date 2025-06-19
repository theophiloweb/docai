/**
 * Seeder de Assinaturas
 * 
 * Este arquivo cria assinaturas fictícias para testes.
 * 
 * @author Doc.AI Team
 */

const { User, Plan, Subscription } = require('../../models');
const logger = require('../../utils/logger');

const createSubscriptions = async () => {
  try {
    // Obter usuários e planos
    const users = await User.findAll({ where: { role: 'user' } });
    const plans = await Plan.findAll();

    // Mapear planos por nome para facilitar o acesso
    const planMap = {};
    plans.forEach(plan => {
      planMap[plan.name] = plan;
    });

    // Criar assinaturas para os usuários
    const subscriptions = [
      {
        userId: users[0].id, // Cliente Exemplo
        planId: planMap['Profissional'].id,
        status: 'active',
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 dias atrás
        endDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000), // 335 dias no futuro
        renewalDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000), // 335 dias no futuro
        paymentMethod: 'credit_card',
        paymentDetails: {
          brand: 'visa',
          lastFour: '4242',
          expiryMonth: 12,
          expiryYear: 2025
        },
        usageData: {
          storageUsed: 2048, // 2GB
          documentsUploaded: 25,
          aiAnalysisUsed: 45
        }
      },
      {
        userId: users[1].id, // Maria Silva
        planId: planMap['Básico'].id,
        status: 'active',
        startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 dias atrás
        endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 dias no futuro
        renewalDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 dias no futuro
        paymentMethod: 'credit_card',
        paymentDetails: {
          brand: 'mastercard',
          lastFour: '5678',
          expiryMonth: 8,
          expiryYear: 2026
        },
        usageData: {
          storageUsed: 512, // 512MB
          documentsUploaded: 12,
          aiAnalysisUsed: 8
        }
      },
      {
        userId: users[2].id, // João Santos
        planId: planMap['Gratuito'].id,
        status: 'active',
        startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 dias atrás
        endDate: null,
        renewalDate: null,
        paymentMethod: null,
        paymentDetails: null,
        usageData: {
          storageUsed: 50, // 50MB
          documentsUploaded: 3,
          aiAnalysisUsed: 2
        }
      },
      {
        userId: users[3].id, // Ana Oliveira
        planId: planMap['Empresarial'].id,
        status: 'canceled',
        startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 dias atrás
        endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 dias atrás
        renewalDate: null,
        canceledAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 dias atrás
        paymentMethod: 'credit_card',
        paymentDetails: {
          brand: 'amex',
          lastFour: '9876',
          expiryMonth: 3,
          expiryYear: 2025
        },
        usageData: {
          storageUsed: 15360, // 15GB
          documentsUploaded: 120,
          aiAnalysisUsed: 200
        }
      },
      {
        userId: users[5].id, // Fernanda Lima
        planId: planMap['Familiar'].id,
        status: 'active',
        startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 dias atrás
        endDate: new Date(Date.now() + 345 * 24 * 60 * 60 * 1000), // 345 dias no futuro
        renewalDate: new Date(Date.now() + 345 * 24 * 60 * 60 * 1000), // 345 dias no futuro
        paymentMethod: 'pix',
        paymentDetails: {
          transactionId: 'pix123456789',
          paymentDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
        },
        usageData: {
          storageUsed: 5120, // 5GB
          documentsUploaded: 45,
          aiAnalysisUsed: 30
        }
      }
    ];

    for (const subscription of subscriptions) {
      await Subscription.create(subscription);
    }

    logger.info('Assinaturas criadas com sucesso!');
  } catch (error) {
    logger.error('Erro ao criar assinaturas:', error);
  }
};

module.exports = createSubscriptions;
