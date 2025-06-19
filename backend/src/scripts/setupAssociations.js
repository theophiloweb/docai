/**
 * Script para configurar associações entre modelos
 * 
 * Este script configura as associações entre os modelos do sistema.
 * 
 * @author Doc.AI Team
 */

const { 
  User, 
  Admin, 
  Client, 
  Document, 
  Subscription, 
  Feedback, 
  Log 
} = require('../models');

const setupAssociations = async () => {
  try {
    console.log('Configurando associações entre modelos...');
    
    // Associações de User
    User.hasOne(Admin, { foreignKey: 'userId', as: 'adminProfile' });
    User.hasOne(Client, { foreignKey: 'userId', as: 'clientProfile' });
    User.hasMany(Document, { foreignKey: 'userId', as: 'documents' });
    User.hasOne(Subscription, { foreignKey: 'userId', as: 'subscription' });
    User.hasMany(Feedback, { foreignKey: 'userId', as: 'feedbacks' });
    User.hasMany(Log, { foreignKey: 'userId', as: 'logs' });

    // Associações de Admin
    Admin.belongsTo(User, { foreignKey: 'userId', as: 'user' });

    // Associações de Client
    Client.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    Client.belongsTo(Client, { foreignKey: 'referredBy', as: 'referrer' });
    Client.hasMany(Client, { foreignKey: 'referredBy', as: 'referrals' });
    Client.hasOne(Subscription, { foreignKey: 'userId', as: 'subscription', sourceKey: 'userId' });
    
    console.log('Associações configuradas com sucesso!');
  } catch (error) {
    console.error('Erro ao configurar associações:', error);
  }
};

// Executar se chamado diretamente
if (require.main === module) {
  setupAssociations()
    .then(() => {
      console.log('Script finalizado.');
      process.exit(0);
    })
    .catch(error => {
      console.error('Erro ao executar script:', error);
      process.exit(1);
    });
}

module.exports = setupAssociations;
