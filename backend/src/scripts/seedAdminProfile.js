/**
 * Script para criar perfil de administrador
 * 
 * Este script cria um perfil de administrador para um usuário admin existente.
 * 
 * @author Doc.AI Team
 */

const { sequelize, User, Admin } = require('../models');

const seedAdminProfile = async () => {
  try {
    console.log('Iniciando criação de perfil de administrador...');
    
    // Criar tabela se não existir
    await sequelize.sync();
    
    // Buscar usuário admin
    const adminUser = await User.findOne({
      where: { role: 'admin' }
    });
    
    if (!adminUser) {
      console.log('Nenhum usuário admin encontrado. Criando usuário admin...');
      
      // Criar usuário admin
      const newAdminUser = await User.create({
        name: 'Administrador',
        email: 'admin@docai.com.br',
        password: '$2a$10$XFpxGgqHGM0OiZU.X5N5KOzQyv4nqQxz1JDcUUVxBcKCECOtbenEO', // senha: admin123
        role: 'admin',
        status: 'active'
      });
      
      console.log('Usuário admin criado com sucesso!');
      
      // Criar perfil de administrador
      await Admin.create({
        userId: newAdminUser.id,
        fullName: 'Administrador do Sistema',
        position: 'Administrador',
        department: 'TI',
        employeeId: 'ADM-001',
        phone: '(11) 99999-9999',
        permissions: {
          users: true,
          documents: true,
          plans: true,
          settings: true,
          logs: true,
          reports: true,
          api: true
        },
        isSuperAdmin: true,
        lastActivity: new Date()
      });
      
      console.log('Perfil de administrador criado com sucesso!');
    } else {
      console.log('Usuário admin encontrado. Verificando perfil...');
      
      // Verificar se já existe perfil
      const adminProfile = await Admin.findOne({
        where: { userId: adminUser.id }
      });
      
      if (adminProfile) {
        console.log('Perfil de administrador já existe. Pulando...');
      } else {
        // Criar perfil de administrador
        await Admin.create({
          userId: adminUser.id,
          fullName: adminUser.name || 'Administrador do Sistema',
          position: 'Administrador',
          department: 'TI',
          employeeId: 'ADM-001',
          phone: '',
          permissions: {
            users: true,
            documents: true,
            plans: true,
            settings: true,
            logs: true,
            reports: true,
            api: true
          },
          isSuperAdmin: true,
          lastActivity: new Date()
        });
        
        console.log('Perfil de administrador criado com sucesso!');
      }
    }
  } catch (error) {
    console.error('Erro ao criar perfil de administrador:', error);
  }
};

// Executar se chamado diretamente
if (require.main === module) {
  seedAdminProfile()
    .then(() => {
      console.log('Script finalizado.');
      process.exit(0);
    })
    .catch(error => {
      console.error('Erro ao executar script:', error);
      process.exit(1);
    });
}

module.exports = seedAdminProfile;
