/**
 * Controlador de Autenticação
 * 
 * Este controlador gerencia as operações de autenticação de usuários.
 * 
 * @author Doc.AI Team
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { User, Admin, Client } = require('../models');
const logger = require('../utils/logger');

// Gerar token JWT
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    process.env.JWT_SECRET || 'docai-super-secret-key-change-in-production',
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
};

// Gerar token de atualização
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET || 'docai-refresh-super-secret-key-change-in-production',
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
};

// Registrar um novo usuário
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verificar se o usuário já existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Este email já está em uso'
      });
    }

    // Criar o usuário
    const user = await User.create({
      name,
      email,
      password,
      role: 'user',
      status: 'active',
      emailVerified: false
    });

    // Criar perfil de cliente
    await Client.create({
      userId: user.id,
      fullName: name,
      onboardingCompleted: false
    });

    // Gerar token de verificação
    const verificationToken = user.generateVerificationToken();
    await user.save();

    // Em um ambiente real, enviaríamos um email com o link de verificação
    // sendVerificationEmail(user.email, verificationToken);

    // Gerar tokens
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // Registrar log
    logger.info(`Novo usuário registrado: ${email}`);

    res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token,
        refreshToken
      }
    });
  } catch (error) {
    logger.error('Erro ao registrar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao registrar usuário',
      error: error.message
    });
  }
};

// Login de usuário
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuário
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Verificar se o usuário está bloqueado
    if (user.status === 'blocked') {
      return res.status(403).json({
        success: false,
        message: 'Sua conta está bloqueada. Entre em contato com o suporte.'
      });
    }

    // Verificar senha diretamente com bcrypt em vez de usar o método do modelo
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Atualizar último login
    user.lastLogin = new Date();
    await user.save();

    // Carregar perfil adicional com base no papel
    let profile = null;
    if (user.role === 'admin') {
      profile = await Admin.findOne({ where: { userId: user.id } });
    } else {
      profile = await Client.findOne({ where: { userId: user.id } });
    }

    // Gerar tokens
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // Registrar log
    logger.info(`Usuário logado: ${email}`);

    res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          emailVerified: user.emailVerified,
          lastLogin: user.lastLogin,
          preferences: user.preferences,
          avatar: user.avatar,
          profile: profile ? {
            id: profile.id,
            fullName: profile.fullName,
            ...(user.role === 'admin' ? {
              position: profile.position,
              department: profile.department,
              isSuperAdmin: profile.isSuperAdmin
            } : {
              onboardingCompleted: profile.onboardingCompleted
            })
          } : null
        },
        token,
        refreshToken
      }
    });
  } catch (error) {
    logger.error('Erro ao fazer login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao fazer login',
      error: error.message
    });
  }
};

// Login de administrador
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuário
    const user = await User.findOne({ 
      where: { 
        email,
        role: 'admin' // Garantir que é um administrador
      } 
    });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais administrativas inválidas'
      });
    }

    // Verificar se o usuário está bloqueado
    if (user.status === 'blocked') {
      return res.status(403).json({
        success: false,
        message: 'Sua conta está bloqueada. Entre em contato com o suporte.'
      });
    }

    // Verificar senha diretamente com bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais administrativas inválidas'
      });
    }

    // Atualizar último login
    user.lastLogin = new Date();
    await user.save();

    // Carregar perfil de administrador
    const adminProfile = await Admin.findOne({ where: { userId: user.id } });
    if (!adminProfile) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao carregar perfil administrativo'
      });
    }

    // Gerar tokens específicos para administrador
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // Registrar log
    logger.info(`Administrador logado: ${email}`);

    res.status(200).json({
      success: true,
      message: 'Login administrativo realizado com sucesso',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          lastLogin: user.lastLogin,
          profile: {
            id: adminProfile.id,
            fullName: adminProfile.fullName,
            position: adminProfile.position,
            department: adminProfile.department,
            isSuperAdmin: adminProfile.isSuperAdmin,
            permissions: adminProfile.permissions
          }
        },
        token,
        refreshToken
      }
    });
  } catch (error) {
    logger.error('Erro ao fazer login administrativo:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao fazer login administrativo',
      error: error.message
    });
  }
};

// Atualizar token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Token de atualização não fornecido'
      });
    }

    // Verificar token de atualização
    const decoded = jwt.verify(
      refreshToken, 
      process.env.JWT_REFRESH_SECRET || 'docai-refresh-super-secret-key-change-in-production'
    );
    
    // Buscar usuário
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Verificar se o usuário está bloqueado
    if (user.status === 'blocked') {
      return res.status(403).json({
        success: false,
        message: 'Sua conta está bloqueada. Entre em contato com o suporte.'
      });
    }

    // Gerar novo token
    const newToken = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Token atualizado com sucesso',
      data: {
        token: newToken
      }
    });
  } catch (error) {
    logger.error('Erro ao atualizar token:', error);
    res.status(401).json({
      success: false,
      message: 'Token de atualização inválido ou expirado',
      error: error.message
    });
  }
};

// Verificar email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Buscar usuário pelo token de verificação
    const user = await User.findOne({ where: { verificationToken: token } });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token de verificação inválido'
      });
    }

    // Atualizar status de verificação
    user.emailVerified = true;
    user.verificationToken = null;
    await user.save();

    // Registrar log
    logger.info(`Email verificado para usuário: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Email verificado com sucesso'
    });
  } catch (error) {
    logger.error('Erro ao verificar email:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar email',
      error: error.message
    });
  }
};

// Solicitar redefinição de senha
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Buscar usuário
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Gerar token de redefinição de senha
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // Em um ambiente real, enviaríamos um email com o link de redefinição
    // sendPasswordResetEmail(user.email, resetToken);

    // Registrar log
    logger.info(`Solicitação de redefinição de senha para: ${email}`);

    res.status(200).json({
      success: true,
      message: 'Email de redefinição de senha enviado'
    });
  } catch (error) {
    logger.error('Erro ao solicitar redefinição de senha:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao solicitar redefinição de senha',
      error: error.message
    });
  }
};

// Redefinir senha
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Buscar usuário pelo token de redefinição
    const user = await User.findOne({ 
      where: { 
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: Date.now() }
      } 
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token de redefinição inválido ou expirado'
      });
    }

    // Atualizar senha
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    // Registrar log
    logger.info(`Senha redefinida para usuário: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Senha redefinida com sucesso'
    });
  } catch (error) {
    logger.error('Erro ao redefinir senha:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao redefinir senha',
      error: error.message
    });
  }
};

// Obter usuário atual
exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Buscar usuário com perfil associado
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Admin,
          as: 'adminProfile',
          required: false
        },
        {
          model: Client,
          as: 'clientProfile',
          required: false
        }
      ]
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    // Formatar resposta
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
      lastLogin: user.lastLogin,
      preferences: user.preferences,
      avatar: user.avatar,
      profile: user.role === 'admin' ? user.adminProfile : user.clientProfile
    };
    
    res.status(200).json({
      success: true,
      data: {
        user: userData
      }
    });
  } catch (error) {
    console.error('Erro ao obter usuário atual:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao obter usuário atual',
      error: error.message
    });
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    // Em um sistema real com tokens armazenados em banco, invalidaríamos o token aqui
    // Como estamos usando JWT, o cliente deve simplesmente descartar o token

    // Registrar log
    if (req.user) {
      logger.info(`Usuário deslogado: ${req.user.email}`);
    }

    res.status(200).json({
      success: true,
      message: 'Logout realizado com sucesso'
    });
  } catch (error) {
    logger.error('Erro ao fazer logout:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao fazer logout',
      error: error.message
    });
  }
};

/**
 * Obtém os dados do usuário atual
 * 
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 */
exports.me = async (req, res) => {
  try {
    const user = req.user;
    
    // Buscar perfil associado (Admin ou Client)
    let profile = null;
    if (user.role === 'admin') {
      profile = await Admin.findOne({ where: { userId: user.id } });
    } else {
      profile = await Client.findOne({ where: { userId: user.id } });
    }
    
    // Remover campos sensíveis
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
      lastLogin: user.lastLogin,
      preferences: user.preferences,
      avatar: user.avatar,
      profile: profile
    };
    
    return res.status(200).json({
      success: true,
      data: {
        user: userData
      }
    });
  } catch (error) {
    logger.error('Erro ao obter usuário atual:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao obter dados do usuário'
    });
  }
};
