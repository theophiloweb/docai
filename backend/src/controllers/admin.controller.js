/**
 * Controlador de administração
 * 
 * Este arquivo define as funções de controle para as rotas de administração.
 * 
 * @author Doc.AI Team
 */

const { User, Client, Plan, Log, Document, Subscription, SystemSettings, Admin } = require('../models');
const { Op } = require('sequelize');

/**
 * Obter perfil do administrador
 */
exports.getAdminProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Buscar perfil de administrador
    const admin = await Admin.findOne({
      where: { userId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'status', 'createdAt', 'lastLogin']
        }
      ]
    });
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Perfil de administrador não encontrado'
      });
    }
    
    // Formatar resposta
    const adminProfile = {
      id: admin.id,
      userId: admin.userId,
      fullName: admin.fullName,
      email: admin.user.email,
      position: admin.position,
      department: admin.department,
      employeeId: admin.employeeId,
      phone: admin.phone,
      permissions: admin.permissions,
      isSuperAdmin: admin.isSuperAdmin,
      status: admin.user.status,
      lastActivity: admin.lastActivity,
      lastLogin: admin.user.lastLogin,
      createdAt: admin.createdAt
    };
    
    return res.status(200).json({
      success: true,
      data: {
        profile: adminProfile
      }
    });
  } catch (error) {
    console.error('Erro ao obter perfil de administrador:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao obter perfil de administrador',
      error: error.message
    });
  }
};

/**
 * Atualizar perfil do administrador
 */
exports.updateAdminProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, position, department, phone } = req.body;
    
    // Buscar perfil de administrador
    const admin = await Admin.findOne({
      where: { userId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ]
    });
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Perfil de administrador não encontrado'
      });
    }
    
    // Atualizar dados
    await admin.update({
      fullName: fullName || admin.fullName,
      position: position !== undefined ? position : admin.position,
      department: department !== undefined ? department : admin.department,
      phone: phone !== undefined ? phone : admin.phone,
      lastActivity: new Date()
    });
    
    // Atualizar nome do usuário se necessário
    if (fullName && admin.user.name !== fullName) {
      await admin.user.update({ name: fullName });
    }
    
    // Registrar atividade
    const activityLog = admin.activityLog || [];
    activityLog.push({
      action: 'profile_update',
      timestamp: new Date(),
      details: 'Perfil atualizado'
    });
    
    // Limitar o tamanho do log de atividades (manter apenas os últimos 50)
    if (activityLog.length > 50) {
      activityLog.splice(0, activityLog.length - 50);
    }
    
    await admin.update({ activityLog });
    
    // Formatar resposta
    const adminProfile = {
      id: admin.id,
      userId: admin.userId,
      fullName: admin.fullName,
      email: admin.user.email,
      position: admin.position,
      department: admin.department,
      employeeId: admin.employeeId,
      phone: admin.phone,
      permissions: admin.permissions,
      isSuperAdmin: admin.isSuperAdmin,
      lastActivity: admin.lastActivity,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt
    };
    
    return res.status(200).json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      data: {
        profile: adminProfile
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil de administrador:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao atualizar perfil de administrador',
      error: error.message
    });
  }
};

/**
 * Obter configurações do sistema
 */
exports.getSystemSettings = async (req, res) => {
  try {
    const settings = await SystemSettings.findAll({
      order: [['category', 'ASC'], ['key', 'ASC']]
    });
    
    // Agrupar configurações por categoria
    const groupedSettings = settings.reduce((acc, setting) => {
      const category = setting.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      
      // Converter valor para o tipo correto
      let value = setting.value;
      switch (setting.type) {
        case 'boolean':
          value = value === 'true';
          break;
        case 'number':
          value = parseFloat(value);
          break;
        case 'json':
          try {
            value = JSON.parse(value);
          } catch (e) {
            value = {};
          }
          break;
      }
      
      acc[category].push({
        id: setting.id,
        key: setting.key,
        value: value,
        type: setting.type,
        description: setting.description,
        isPublic: setting.isPublic
      });
      
      return acc;
    }, {});
    
    return res.status(200).json({
      success: true,
      data: {
        settings: groupedSettings
      }
    });
  } catch (error) {
    console.error('Erro ao obter configurações do sistema:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao obter configurações do sistema',
      error: error.message
    });
  }
};

/**
 * Atualizar configuração do sistema
 */
exports.updateSystemSetting = async (req, res) => {
  try {
    const { id } = req.params;
    const { value } = req.body;
    
    // Buscar configuração
    const setting = await SystemSettings.findByPk(id);
    
    if (!setting) {
      return res.status(404).json({
        success: false,
        message: 'Configuração não encontrada'
      });
    }
    
    // Converter valor para string antes de salvar
    let valueToSave = value;
    if (typeof value === 'object') {
      valueToSave = JSON.stringify(value);
    } else if (typeof value === 'boolean' || typeof value === 'number') {
      valueToSave = String(value);
    }
    
    // Atualizar valor
    await setting.update({ value: valueToSave });
    
    return res.status(200).json({
      success: true,
      message: 'Configuração atualizada com sucesso',
      data: {
        setting: {
          id: setting.id,
          key: setting.key,
          value: value,
          type: setting.type,
          category: setting.category,
          description: setting.description,
          isPublic: setting.isPublic
        }
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar configuração do sistema:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao atualizar configuração do sistema',
      error: error.message
    });
  }
};

/**
 * Atualizar múltiplas configurações do sistema
 */
exports.updateSystemSettings = async (req, res) => {
  try {
    const { settings } = req.body;
    
    if (!settings || !Array.isArray(settings)) {
      return res.status(400).json({
        success: false,
        message: 'Formato inválido. Esperado um array de configurações.'
      });
    }
    
    const updatedSettings = [];
    
    // Atualizar cada configuração
    for (const item of settings) {
      if (!item.id || item.value === undefined) {
        continue;
      }
      
      const setting = await SystemSettings.findByPk(item.id);
      
      if (!setting) {
        continue;
      }
      
      // Converter valor para string antes de salvar
      let valueToSave = item.value;
      if (typeof item.value === 'object') {
        valueToSave = JSON.stringify(item.value);
      } else if (typeof item.value === 'boolean' || typeof item.value === 'number') {
        valueToSave = String(item.value);
      }
      
      // Atualizar valor
      await setting.update({ value: valueToSave });
      
      // Converter valor para o tipo correto para a resposta
      let value = valueToSave;
      switch (setting.type) {
        case 'boolean':
          value = value === 'true';
          break;
        case 'number':
          value = parseFloat(value);
          break;
        case 'json':
          try {
            value = JSON.parse(value);
          } catch (e) {
            value = {};
          }
          break;
      }
      
      updatedSettings.push({
        id: setting.id,
        key: setting.key,
        value: value,
        type: setting.type,
        category: setting.category,
        description: setting.description,
        isPublic: setting.isPublic
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Configurações atualizadas com sucesso',
      data: {
        settings: updatedSettings
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar configurações do sistema:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao atualizar configurações do sistema',
      error: error.message
    });
  }
}; 

/**
 * Controlador de administração
 * 
 * Este arquivo define as funções de controle para as rotas de administração.
 * 
 * @author Doc.AI Team
 */

// Removendo importação duplicada
// const { Op } = require('sequelize');

/**
 * Obter dados do dashboard administrativo
 */
exports.getDashboardData = async (req, res) => {
  try {
    // Contagem de usuários
    const totalUsers = await User.count({
      where: { role: 'user' }
    });
    
    const activeUsers = await User.count({
      where: { 
        role: 'user',
        status: 'active'
      }
    });
    
    // Contagem de documentos
    const totalDocuments = await Document.count();
    
    const processedDocuments = await Document.count({
      where: {
        ai_processed: true
      }
    });
    
    // Contagem de planos
    const totalPlans = await Plan.count();
    
    const activePlans = await Plan.count({
      where: {
        isActive: true
      }
    });
    
    // Usuários online (simulado - em produção seria baseado em sessões ativas)
    const onlineUsers = Math.floor(activeUsers * 0.1); // 10% dos usuários ativos
    
    // Logins recentes
    const recentLogins = await Log.findAll({
      where: {
        type: 'auth',
        message: 'Login bem-sucedido'
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'role']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 5
    });
    
    // Formatar logins recentes
    const formattedLogins = recentLogins.map(log => ({
      id: log.id,
      name: log.user ? log.user.name : 'Usuário Desconhecido',
      email: log.user ? log.user.email : 'email@desconhecido.com',
      time: log.createdAt,
      type: log.user ? log.user.role : 'user'
    }));
    
    // Retornar dados do dashboard
    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        totalDocuments,
        processedDocuments,
        totalPlans,
        activePlans,
        systemHealth: 'healthy', // Poderia ser calculado com base em métricas do sistema
        onlineUsers,
        recentLogins: formattedLogins,
        userGrowth: {
          percentage: 12.5,
          trend: 'up'
        },
        revenueGrowth: {
          percentage: 8.3,
          trend: 'up'
        }
      }
    });
  } catch (error) {
    console.error('Erro ao obter dados do dashboard:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao obter dados do dashboard',
      error: error.message
    });
  }
};

/**
 * Obter lista de usuários
 */
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'status', 'lastLogin', 'createdAt']
    });
    
    // Formatar usuários
    const formattedUsers = users.map(user => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        plan: 'free', // Valor padrão
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      };
    });
    
    return res.status(200).json({
      success: true,
      data: {
        users: formattedUsers
      }
    });
  } catch (error) {
    console.error('Erro ao obter usuários:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao obter usuários',
      error: error.message
    });
  }
};

/**
 * Criar novo usuário
 */
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, status } = req.body;
    
    // Validar dados
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Dados incompletos. Nome, email e senha são obrigatórios.'
      });
    }
    
    // Verificar se o email já existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Este email já está em uso.'
      });
    }
    
    // Criar usuário
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
      status: status || 'active'
    });
    
    // Se for um usuário comum (não admin), criar perfil de cliente
    if (user.role === 'user') {
      await Client.create({
        userId: user.id,
        fullName: name
      });
    }
    
    // Retornar resposta sem a senha
    return res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          plan: 'free',
          lastLogin: null,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao criar usuário',
      error: error.message
    });
  }
};

/**
 * Atualizar usuário existente
 */
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, status } = req.body;
    
    // Buscar usuário
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    // Verificar se o email já existe (se estiver sendo alterado)
    if (email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Este email já está em uso.'
        });
      }
    }
    
    // Preparar dados para atualização
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = password;
    if (role) updateData.role = role;
    if (status) updateData.status = status;
    
    // Atualizar usuário
    await user.update(updateData);
    
    // Se for um usuário comum (não admin), atualizar perfil de cliente
    if (user.role === 'user' && name) {
      const client = await Client.findOne({ where: { userId: user.id } });
      if (client) {
        await client.update({ fullName: name });
      } else {
        await Client.create({
          userId: user.id,
          fullName: name
        });
      }
    }
    
    // Retornar resposta sem a senha
    return res.status(200).json({
      success: true,
      message: 'Usuário atualizado com sucesso',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao atualizar usuário',
      error: error.message
    });
  }
};

/**
 * Excluir usuário
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar usuário
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    // Excluir perfil de cliente se existir
    if (user.role === 'user') {
      const client = await Client.findOne({ where: { userId: user.id } });
      if (client) {
        await client.destroy();
      }
    }
    
    // Excluir usuário
    await user.destroy();
    
    return res.status(200).json({
      success: true,
      message: 'Usuário excluído com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao excluir usuário',
      error: error.message
    });
  }
};

/**
 * Atualizar status do usuário
 */
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validar status
    if (!['active', 'inactive', 'blocked'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status inválido. Valores permitidos: active, inactive, blocked'
      });
    }
    
    // Buscar usuário
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    // Atualizar status
    await user.update({ status });
    
    return res.status(200).json({
      success: true,
      message: 'Status do usuário atualizado com sucesso',
      data: {
        user: {
          id: user.id,
          status: user.status
        }
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar status do usuário:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao atualizar status do usuário',
      error: error.message
    });
  }
};

/**
 * Obter configurações de IA
 */

/**
 * Criar configuração de IA
 */

/**
 * Atualizar configuração de IA
 */

/**
 * Excluir configuração de IA
 */

/**
 * Atualizar status de configuração de IA
 */

/**
 * Obter logs do sistema com paginação e filtros
 */
exports.getLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, level, search, startDate, endDate } = req.query;
    const offset = (page - 1) * limit;
    
    // Construir condições de filtro
    const where = {};
    
    if (type && type !== 'all') {
      where.type = type;
    }
    
    if (level && level !== 'all') {
      where.level = level;
    }
    
    if (search) {
      where.message = {
        [Op.iLike]: `%${search}%`
      };
    }
    
    // Filtrar por período, se fornecido
    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }
    
    // Buscar logs com paginação e filtros
    const { count, rows: logs } = await Log.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    // Formatar logs
    const formattedLogs = logs.map(log => ({
      id: log.id,
      timestamp: log.createdAt,
      level: log.level,
      user: log.user ? {
        id: log.user.id,
        name: log.user.name,
        email: log.user.email
      } : null,
      type: log.type,
      message: log.message,
      details: log.details,
      ip: log.ip
    }));
    
    return res.status(200).json({
      success: true,
      data: {
        logs: formattedLogs,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Erro ao obter logs:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao obter logs',
      error: error.message
    });
  }
};

/**
 * Obter planos
 */
exports.getPlans = async (req, res) => {
  try {
    console.log('Buscando planos...');
    const plans = await Plan.findAll();
    console.log('Planos encontrados:', plans.length);
    
    // Formatar planos para o formato esperado pelo frontend
    const formattedPlans = plans.map(plan => {
      // Converter features de array para array (caso seja string)
      let features = plan.features;
      if (typeof features === 'string') {
        try {
          features = JSON.parse(features);
        } catch (e) {
          features = [features];
        }
      }
      
      return {
        id: plan.id,
        name: plan.name,
        description: plan.description,
        price: plan.price,
        billingCycle: plan.billingCycle || 'monthly',
        features: features || [],
        storageLimit: plan.storageLimit,
        documentLimit: plan.documentLimit,
        aiAnalysisLimit: plan.aiAnalysisLimit,
        isPopular: plan.isPopular,
        isActive: plan.isActive,
        displayOrder: plan.displayOrder,
        createdAt: plan.createdAt,
        updatedAt: plan.updatedAt
      };
    });
    
    console.log('Planos formatados:', formattedPlans.length);
    
    return res.status(200).json({
      success: true,
      data: {
        plans: formattedPlans
      }
    });
  } catch (error) {
    console.error('Erro ao obter planos:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao obter planos',
      error: error.message
    });
  }
};

/**
 * Criar plano
 */
exports.createPlan = async (req, res) => {
  try {
    const { name, description, price, billingPeriod, durationDays, features, status } = req.body;
    
    // Validar dados
    if (!name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Dados incompletos. Nome e preço são obrigatórios.'
      });
    }
    
    // Converter features para formato adequado para armazenamento
    let featuresData = features;
    if (Array.isArray(features)) {
      featuresData = features;
    } else if (typeof features === 'string') {
      try {
        featuresData = features.split('\n').filter(f => f.trim() !== '');
      } catch (e) {
        featuresData = [features];
      }
    }
    
    // Criar plano
    const plan = await Plan.create({
      name,
      description: description || '',
      price: parseFloat(price),
      billingCycle: billingPeriod || 'monthly',
      features: featuresData,
      storageLimit: 1000, // Valores padrão
      documentLimit: 100, // Valores padrão
      aiAnalysisLimit: 50, // Valores padrão
      isActive: status === 'active'
    });
    
    // Formatar resposta
    const formattedPlan = {
      id: plan.id,
      name: plan.name,
      description: plan.description,
      price: plan.price,
      billingPeriod: plan.billingCycle,
      features: plan.features,
      status: plan.isActive ? 'active' : 'inactive',
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt
    };
    
    return res.status(201).json({
      success: true,
      message: 'Plano criado com sucesso',
      data: {
        plan: formattedPlan
      }
    });
  } catch (error) {
    console.error('Erro ao criar plano:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao criar plano',
      error: error.message
    });
  }
};

/**
 * Atualizar plano
 */
exports.updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, billingPeriod, durationDays, features, status } = req.body;
    
    // Buscar plano
    const plan = await Plan.findByPk(id);
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plano não encontrado'
      });
    }
    
    // Converter features para formato adequado para armazenamento
    let featuresData = features;
    if (Array.isArray(features)) {
      featuresData = features;
    } else if (typeof features === 'string') {
      try {
        featuresData = features.split('\n').filter(f => f.trim() !== '');
      } catch (e) {
        featuresData = [features];
      }
    }
    
    // Atualizar plano
    await plan.update({
      name: name || plan.name,
      description: description !== undefined ? description : plan.description,
      price: price !== undefined ? parseFloat(price) : plan.price,
      billingCycle: billingPeriod || plan.billingCycle,
      features: featuresData || plan.features,
      isActive: status !== undefined ? status === 'active' : plan.isActive
    });
    
    // Formatar resposta
    const formattedPlan = {
      id: plan.id,
      name: plan.name,
      description: plan.description,
      price: plan.price,
      billingPeriod: plan.billingCycle,
      features: plan.features,
      status: plan.isActive ? 'active' : 'inactive',
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt
    };
    
    return res.status(200).json({
      success: true,
      message: 'Plano atualizado com sucesso',
      data: {
        plan: formattedPlan
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar plano:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao atualizar plano',
      error: error.message
    });
  }
};

/**
 * Excluir plano
 */
exports.deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar plano
    const plan = await Plan.findByPk(id);
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plano não encontrado'
      });
    }
    
    // Verificar se há assinaturas associadas a este plano
    const subscriptionCount = await Subscription.count({
      where: { planId: id }
    });
    
    if (subscriptionCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Não é possível excluir um plano que possui assinaturas ativas'
      });
    }
    
    // Excluir plano
    await plan.destroy();
    
    return res.status(200).json({
      success: true,
      message: 'Plano excluído com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir plano:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao excluir plano',
      error: error.message
    });
  }
};
