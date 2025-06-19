/**
 * Script para verificar planos no banco de dados
 */

const { Plan, sequelize } = require('../models');

async function checkPlans() {
  try {
    // Conectar ao banco de dados
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');

    // Verificar tabelas existentes
    const [tables] = await sequelize.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';");
    console.log('Tabelas existentes:', tables.map(t => t.table_name));

    // Verificar se a tabela Plans existe
    const plansTable = tables.find(t => t.table_name.toLowerCase() === 'plans');
    if (!plansTable) {
      console.log('A tabela Plans não existe. Criando tabela...');
      await Plan.sync();
      console.log('Tabela Plans criada com sucesso.');
    }

    // Verificar planos existentes
    const plans = await Plan.findAll();
    
    if (plans.length > 0) {
      console.log(`${plans.length} planos encontrados:`);
      plans.forEach(plan => {
        console.log(JSON.stringify(plan.toJSON(), null, 2));
      });
    } else {
      console.log('Nenhum plano encontrado. Criando planos de exemplo...');
      
      // Criar planos de exemplo
      await Plan.bulkCreate([
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
      ]);
      
      console.log('Planos de exemplo criados com sucesso!');
      
      // Verificar planos criados
      const createdPlans = await Plan.findAll();
      console.log(`${createdPlans.length} planos encontrados após criação:`);
      createdPlans.forEach(plan => {
        console.log(JSON.stringify(plan.toJSON(), null, 2));
      });
    }
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    // Fechar conexão
    await sequelize.close();
  }
}

// Executar função
checkPlans();
