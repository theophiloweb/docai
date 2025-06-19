/**
 * Rotas de usuário
 * 
 * Este arquivo define as rotas relacionadas aos usuários.
 * 
 * @author Doc.AI Team
 */

const express = require('express');
const router = express.Router();

// Função temporária para obter perfil do usuário
const getUserProfile = (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: {
        id: '123',
        name: 'Usuário Teste',
        email: 'usuario@teste.com',
        role: 'user',
        preferences: {
          theme: 'light',
          language: 'pt-BR'
        }
      }
    }
  });
};

// Função temporária para atualizar perfil do usuário
const updateUserProfile = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Perfil atualizado com sucesso',
    data: {
      user: {
        id: '123',
        name: req.body.name || 'Usuário Teste',
        email: 'usuario@teste.com',
        role: 'user'
      }
    }
  });
};

// Função temporária para obter consentimentos do usuário
const getUserConsents = (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      consents: {
        data_processing: true,
        ai_processing: true,
        marketing_emails: false,
        third_party_sharing: false
      }
    }
  });
};

// Função temporária para atualizar consentimentos do usuário
const updateUserConsents = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Consentimentos atualizados com sucesso'
  });
};

// Rotas
router.get('/me', getUserProfile);
router.put('/me', updateUserProfile);
router.get('/consents', getUserConsents);
router.put('/consents', updateUserConsents);

module.exports = router;
