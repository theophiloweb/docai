/**
 * Seeder de Administradores e Clientes
 * 
 * Este arquivo cria perfis de administradores e clientes fictícios para testes.
 * 
 * @author Doc.AI Team
 */

const { Op } = require('sequelize');
const { User, Admin, Client } = require('../../models');
const logger = require('../../utils/logger');

const createAdminsAndClients = async () => {
  try {
    // Obter usuários
    const adminUser = await User.findOne({ where: { email: 'admin@docai.com.br' } });
    const clientUser = await User.findOne({ where: { email: 'cliente@exemplo.com' } });
    const regularUsers = await User.findAll({ 
      where: { 
        email: {
          [Op.notIn]: ['admin@docai.com.br', 'cliente@exemplo.com']
        },
        role: 'user'
      } 
    });

    // Criar perfil de administrador
    if (adminUser) {
      await Admin.create({
        userId: adminUser.id,
        fullName: 'Administrador do Sistema',
        position: 'Gerente de TI',
        department: 'Tecnologia',
        employeeId: 'ADM001',
        phone: '(11) 98765-4321',
        isSuperAdmin: true,
        lastActivity: new Date()
      });
      logger.info('Perfil de administrador criado com sucesso!');
    }

    // Criar perfil de cliente exemplo
    if (clientUser) {
      await Client.create({
        userId: clientUser.id,
        fullName: 'Cliente Exemplo da Silva',
        cpf: '123.456.789-00',
        birthDate: '1985-05-15',
        phone: '(11) 91234-5678',
        address: 'Rua Exemplo, 123',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567',
        profession: 'Engenheiro de Software',
        company: 'Tech Solutions',
        documentCategories: ['saude', 'financeiro', 'juridico'],
        onboardingCompleted: true,
        referralCode: 'CLIENTE123'
      });
      logger.info('Perfil de cliente exemplo criado com sucesso!');
    }

    // Criar perfis para os demais usuários
    for (const user of regularUsers) {
      await Client.create({
        userId: user.id,
        fullName: user.name,
        cpf: `${Math.floor(100000000 + Math.random() * 900000000)}-${Math.floor(10 + Math.random() * 90)}`,
        birthDate: new Date(Date.now() - (20 + Math.floor(Math.random() * 40)) * 365 * 24 * 60 * 60 * 1000),
        phone: `(${Math.floor(10 + Math.random() * 90)}) 9${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
        address: `Rua ${['das Flores', 'dos Pinheiros', 'Alameda Santos', 'Avenida Paulista', 'Rua Augusta'][Math.floor(Math.random() * 5)]}, ${Math.floor(1 + Math.random() * 1000)}`,
        city: ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Porto Alegre'][Math.floor(Math.random() * 5)],
        state: ['SP', 'RJ', 'MG', 'PR', 'RS'][Math.floor(Math.random() * 5)],
        zipCode: `${Math.floor(10000 + Math.random() * 90000)}-${Math.floor(100 + Math.random() * 900)}`,
        profession: ['Médico', 'Advogado', 'Engenheiro', 'Professor', 'Contador'][Math.floor(Math.random() * 5)],
        company: ['Hospital Central', 'Escritório Jurídico', 'Construtora Nacional', 'Universidade Federal', 'Contabilidade Express'][Math.floor(Math.random() * 5)],
        documentCategories: [
          ['saude', 'pessoal'],
          ['financeiro', 'juridico'],
          ['saude', 'financeiro', 'pessoal'],
          ['juridico', 'educacao'],
          ['financeiro', 'trabalho']
        ][Math.floor(Math.random() * 5)],
        onboardingCompleted: Math.random() > 0.2,
        referralCode: `REF${Math.floor(1000 + Math.random() * 9000)}`
      });
    }

    logger.info('Perfis de clientes criados com sucesso!');
  } catch (error) {
    logger.error('Erro ao criar perfis de administradores e clientes:', error);
  }
};

module.exports = createAdminsAndClients;
