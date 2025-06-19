/**
 * Script para testar a API de planos
 */

const axios = require('axios');
const jwt = require('jsonwebtoken');

async function testPlansAPI() {
  try {
    // Criar um token JWT para um usuário administrador
    const token = jwt.sign(
      { id: 'ae58704f-4c74-4f6c-aa68-3c1f15bdb99d', email: 'admin@docai.com.br', role: 'admin' },
      'docai-super-secret-key-change-in-production',
      { expiresIn: '1h' }
    );

    // Fazer requisição para a API
    const response = await axios.get('http://localhost:3001/api/admin/plans', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Resposta da API:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Erro ao acessar a API:', error.response ? error.response.data : error.message);
  }
}

// Executar função
testPlansAPI();
