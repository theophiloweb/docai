/**
 * Script para verificar se o usuário administrador existe
 */

const { User, Admin } = require('../models');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

async function checkAdmin() {
  try {
    // Conectar ao banco de dados
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');

    // Verificar se o usuário existe
    const user = await User.findOne({ 
      where: { email: 'admin@docai.com.br' },
      raw: true
    });
    
    if (user) {
      console.log('Usuário encontrado:');
      console.log(JSON.stringify(user, null, 2));
      
      // Verificar perfil de administrador
      const admin = await Admin.findOne({ 
        where: { user_id: user.id },
        raw: true
      });
      
      if (admin) {
        console.log('Perfil de administrador encontrado:');
        console.log(JSON.stringify(admin, null, 2));
      } else {
        console.log('Perfil de administrador não encontrado.');
        
        // Criar perfil de administrador
        console.log('Criando perfil de administrador...');
        await Admin.create({
          userId: user.id,
          fullName: 'Administrador do Sistema',
          position: 'Administrador',
          department: 'TI',
          employeeId: 'ADM001',
          phone: '(11) 99999-9999',
          permissions: ['all'],
          isSuperAdmin: true
        });
        console.log('Perfil de administrador criado com sucesso!');
      }
      
      // Atualizar senha
      console.log('Atualizando senha do administrador...');
      await User.update(
        { password: await bcrypt.hash('admin123', 10) },
        { where: { id: user.id } }
      );
      console.log('Senha atualizada com sucesso!');
    } else {
      console.log('Usuário administrador não encontrado.');
      
      // Criar usuário
      console.log('Criando usuário administrador...');
      const newUser = await User.create({
        name: 'Administrador',
        email: 'admin@docai.com.br',
        password: await bcrypt.hash('admin123', 10),
        role: 'admin',
        status: 'active',
        emailVerified: true
      });
      
      // Criar perfil de administrador
      console.log('Criando perfil de administrador...');
      await Admin.create({
        userId: newUser.id,
        fullName: 'Administrador do Sistema',
        position: 'Administrador',
        department: 'TI',
        employeeId: 'ADM001',
        phone: '(11) 99999-9999',
        permissions: ['all'],
        isSuperAdmin: true
      });
      
      console.log('Usuário administrador criado com sucesso!');
    }
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    // Fechar conexão
    await sequelize.close();
  }
}

// Executar função
checkAdmin();

// Executar função
checkAdmin();
