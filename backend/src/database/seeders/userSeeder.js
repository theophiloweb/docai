/**
 * Seeder de Usuários
 * 
 * Este arquivo cria usuários fictícios para testes.
 * 
 * @author Doc.AI Team
 */

const bcrypt = require('bcryptjs');
const { User } = require('../../models');
const logger = require('../../utils/logger');

const createUsers = async () => {
  try {
    // Criar usuário administrador
    await User.create({
      name: 'Administrador',
      email: 'admin@docai.com.br',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
      status: 'active',
      emailVerified: true,
      lastLogin: new Date(),
      preferences: {
        theme: 'dark',
        language: 'pt-BR',
        notifications: {
          email: true,
          push: true
        }
      }
    });

    // Criar usuário cliente
    await User.create({
      name: 'Cliente Exemplo',
      email: 'cliente@exemplo.com',
      password: await bcrypt.hash('cliente123', 10),
      role: 'user',
      status: 'active',
      emailVerified: true,
      lastLogin: new Date(),
      preferences: {
        theme: 'light',
        language: 'pt-BR',
        notifications: {
          email: true,
          push: false
        }
      }
    });

    // Criar usuários fictícios
    const users = [
      {
        name: 'Maria Silva',
        email: 'maria@exemplo.com',
        password: await bcrypt.hash('senha123', 10),
        role: 'user',
        status: 'active',
        emailVerified: true,
        lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 dias atrás
      },
      {
        name: 'João Santos',
        email: 'joao@exemplo.com',
        password: await bcrypt.hash('senha123', 10),
        role: 'user',
        status: 'active',
        emailVerified: true,
        lastLogin: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 dias atrás
      },
      {
        name: 'Ana Oliveira',
        email: 'ana@exemplo.com',
        password: await bcrypt.hash('senha123', 10),
        role: 'user',
        status: 'blocked',
        emailVerified: true,
        lastLogin: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 dias atrás
      },
      {
        name: 'Carlos Pereira',
        email: 'carlos@exemplo.com',
        password: await bcrypt.hash('senha123', 10),
        role: 'user',
        status: 'inactive',
        emailVerified: false,
        lastLogin: null
      },
      {
        name: 'Fernanda Lima',
        email: 'fernanda@exemplo.com',
        password: await bcrypt.hash('senha123', 10),
        role: 'user',
        status: 'active',
        emailVerified: true,
        lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 dia atrás
      }
    ];

    for (const user of users) {
      await User.create(user);
    }

    logger.info('Usuários criados com sucesso!');
  } catch (error) {
    logger.error('Erro ao criar usuários:', error);
  }
};

module.exports = createUsers;
