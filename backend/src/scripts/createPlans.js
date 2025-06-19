/**
 * Script para criar planos no banco de dados
 */

const { Plan, sequelize } = require('../models');

async function createPlans() {
  try {
    // Conectar ao banco de dados
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');

    // Sincronizar modelo com o banco de dados
    await Plan.sync();
    console.log('Modelo Plan sincronizado com o banco de dados.');

    // Verificar planos existentes
    const existingPlans = await Plan.findAll();
    
    if (existingPlans.length > 0) {
      console.log(`${existingPlans.length} planos já existem no banco de dados.`);
      existingPlans.forEach(plan => {
        console.log(`- ${plan.name}: R$ ${plan.price} (${plan.isActive ? 'Ativo' : 'Inativo'})`);
      });
    } else {
      console.log('Nenhum plano encontrado. Criando planos de exemplo...');
      
      // Criar planos de exemplo
      const plans = [
        {
          name: 'Plano Básico',
          description: 'Para usuários iniciantes',
          price: 29.90,
          billingCycle: 'monthly',
          features: ['Armazenamento de 5GB', 'Até 100 documentos', '10 análises de IA por mês'],
          storageLimit: 5000,
          documentLimit: 100,
          aiAnalysisLimit: 10,
          isPopular: false,
          isActive: true,
          displayOrder: 1
        },
        {
          name: 'Plano Premium',
          description: 'Para usuários avançados',
          price: 59.90,
          billingCycle: 'monthly',
          features: ['Armazenamento de 20GB', 'Até 500 documentos', '50 análises de IA por mês', 'Suporte prioritário'],
          storageLimit: 20000,
          documentLimit: 500,
          aiAnalysisLimit: 50,
          isPopular: true,
          isActive: true,
          displayOrder: 2
        },
        {
          name: 'Plano Empresarial',
          description: 'Para pequenas empresas',
          price: 149.90,
          billingCycle: 'monthly',
          features: ['Armazenamento de 100GB', 'Documentos ilimitados', 'Análises de IA ilimitadas', 'Suporte 24/7', 'API de integração'],
          storageLimit: 100000,
          documentLimit: -1, // ilimitado
          aiAnalysisLimit: -1, // ilimitado
          isPopular: false,
          isActive: true,
          displayOrder: 3
        }
      ];
      
      for (const planData of plans) {
        await Plan.create(planData);
        console.log(`Plano "${planData.name}" criado com sucesso.`);
      }
      
      console.log('Planos de exemplo criados com sucesso!');
    }
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    // Fechar conexão
    await sequelize.close();
  }
}

// Executar função
createPlans();
