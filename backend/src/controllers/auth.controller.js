/**
 * Controlador de Autenticação
 * 
 * Este controlador gerencia as operações relacionadas à autenticação.
 * 
 * @author Doc.AI Team
 */

const jwt = require('jsonwebtoken');
const { User } = require('../models');
const logger = require('../utils/logger');
require('dotenv').config();

/**
 * Login de usuário
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    logger.info(`Login attempt: ${JSON.stringify({ email, password })}`);
    
    // Buscar usuário pelo email
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }
    
    // Verificar senha
    const isPasswordValid = await user.checkPassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }
    
    // Verificar status do usuário
    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Conta de usuário inativa ou suspensa'
      });
    }
    
    // Atualizar último login
    user.lastLogin = new Date();
    await user.save();
    
    // Gerar tokens
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );
    
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );
    
    res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso',
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
    logger.error('Erro ao fazer login:', error);
    
    res.status(500).json({
      success: false,
      message: 'Erro ao fazer login',
      error: error.message
    });
  }
};

/**
 * Registro de usuário
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Verificar se o email já está em uso
    const existingUser = await User.findOne({ where: { email } });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email já está em uso'
      });
    }
    
    // Criar usuário
    const user = await User.create({
      name,
      email,
      password,
      role: 'user',
      status: 'active'
    });
    
    // Gerar tokens
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );
    
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );
    
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

/**
 * Atualização de token
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 */
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token não fornecido'
      });
    }
    
    // Verificar refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Buscar usuário
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    // Verificar status do usuário
    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Conta de usuário inativa ou suspensa'
      });
    }
    
    // Gerar novos tokens
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );
    
    const newRefreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );
    
    res.status(200).json({
      success: true,
      message: 'Token atualizado com sucesso',
      data: {
        token,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    logger.error('Erro ao atualizar token:', error);
    
    res.status(401).json({
      success: false,
      message: 'Refresh token inválido ou expirado',
      error: error.message
    });
  }
};

/**
 * Obter dados do usuário autenticado
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 */
exports.me = async (req, res) => {
  try {
    const user = req.user;
    
    res.status(200).json({
      success: true,
      message: 'Dados do usuário obtidos com sucesso',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          preferences: user.preferences
        }
      }
    });
  } catch (error) {
    logger.error('Erro ao obter dados do usuário:', error);
    
    res.status(500).json({
      success: false,
      message: 'Erro ao obter dados do usuário',
      error: error.message
    });
  }
};

/**
 * Solicitar redefinição de senha
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Buscar usuário pelo email
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      // Por segurança, não informar que o email não existe
      return res.status(200).json({
        success: true,
        message: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha'
      });
    }
    
    // Gerar token de redefinição de senha
    const resetToken = user.generatePasswordResetToken();
    await user.save();
    
    // Em um ambiente real, enviar email com o link de redefinição
    // Aqui apenas simulamos o envio
    
    res.status(200).json({
      success: true,
      message: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha',
      // Em ambiente de desenvolvimento, retornar o token para testes
      ...(process.env.NODE_ENV === 'development' && { resetToken })
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

/**
 * Redefinir senha
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    
    // Buscar usuário pelo token
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido ou expirado'
      });
    }
    
    // Atualizar senha
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    
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
