/**
 * Script para criar um usuário administrador
 * 
 * Este script cria um usuário administrador no banco de dados.
 * 
 * @author Doc.AI Team
 */

const { User, Admin } = require('../models');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  try {
    // Conectar ao banco de dados
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');

    // Verificar se o usuário já existe
    const existingUser = await User.findOne({ where: { email: 'admin@docai.com.br' } });
    
    if (existingUser) {
      console.log('Usuário administrador já existe.');
      return;
    }

    // Criar usuário
    const user = await User.create({
      name: 'Administrador',
      email: 'admin@docai.com.br',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
      status: 'active',
      emailVerified: true
    });

    // Criar perfil de administrador
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

    console.log('Usuário administrador criado com sucesso!');
    console.log('Email: admin@docai.com.br');
    console.log('Senha: admin123');
  } catch (error) {
    console.error('Erro ao criar usuário administrador:', error);
  } finally {
    // Fechar conexão
    await sequelize.close();
  }
}

// Executar função
createAdmin();
