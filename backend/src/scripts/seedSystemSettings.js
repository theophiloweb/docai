/**
 * Script para popular as configurações do sistema
 * 
 * Este script cria as configurações padrão do sistema no banco de dados.
 * 
 * @author Doc.AI Team
 */

const { sequelize, SystemSettings } = require('../models');

const seedSystemSettings = async () => {
  try {
    console.log('Iniciando população de configurações do sistema...');
    
    // Configurações do sistema
    const systemSettings = [
      {
        key: 'maintenance',
        value: 'false',
        type: 'boolean',
        category: 'system',
        description: 'Modo de manutenção do sistema',
        isPublic: true
      },
      {
        key: 'debugMode',
        value: 'false',
        type: 'boolean',
        category: 'system',
        description: 'Modo de depuração do sistema',
        isPublic: false
      },
      {
        key: 'allowRegistration',
        value: 'true',
        type: 'boolean',
        category: 'security',
        description: 'Permitir registro de novos usuários',
        isPublic: true
      },
      {
        key: 'requireEmailVerification',
        value: 'true',
        type: 'boolean',
        category: 'security',
        description: 'Exigir verificação de email para novos usuários',
        isPublic: true
      },
      {
        key: 'maxUploadSize',
        value: '10',
        type: 'number',
        category: 'system',
        description: 'Tamanho máximo de upload em MB',
        isPublic: true
      },
      {
        key: 'sessionTimeout',
        value: '30',
        type: 'number',
        category: 'security',
        description: 'Tempo limite de sessão em minutos',
        isPublic: false
      },
      {
        key: 'backupFrequency',
        value: 'daily',
        type: 'string',
        category: 'system',
        description: 'Frequência de backup do sistema',
        isPublic: false
      }
    ];
    
    // Criar tabela se não existir
    await sequelize.sync();
    
    // Verificar se já existem configurações
    const count = await SystemSettings.count();
    
    if (count > 0) {
      console.log('Configurações já existem. Pulando...');
      return;
    }
    
    // Criar configurações
    await SystemSettings.bulkCreate(systemSettings);
    
    console.log('Configurações do sistema criadas com sucesso!');
  } catch (error) {
    console.error('Erro ao popular configurações do sistema:', error);
  }
};

// Executar se chamado diretamente
if (require.main === module) {
  seedSystemSettings()
    .then(() => {
      console.log('Script finalizado.');
      process.exit(0);
    })
    .catch(error => {
      console.error('Erro ao executar script:', error);
      process.exit(1);
    });
}

module.exports = seedSystemSettings;
