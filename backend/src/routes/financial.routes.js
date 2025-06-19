/**
 * Rotas Financeiras
 * 
 * Este arquivo define as rotas relacionadas aos registros financeiros.
 * 
 * @author Doc.AI Team
 */

const express = require('express');
const router = express.Router();
const financialController = require('../controllers/financial.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Middleware de autenticação para todas as rotas
router.use(authMiddleware);

// Rota para obter dados do dashboard financeiro
router.get('/dashboard', financialController.getDashboardData);

// Rota para obter análise financeira
router.post('/analysis', async (req, res) => {
  try {
    const { data } = req.body;
    
    // Dados de exemplo para análise financeira
    const analysisData = {
      summary: "Seus gastos com Moradia representam 37% do total de despesas, seguido por Alimentação (26%). Considere revisar seus gastos com Lazer que aumentaram 15% em relação ao mês anterior.",
      recommendations: [
        "Considere reduzir gastos com serviços de streaming não utilizados",
        "Sua reserva de emergência está abaixo do recomendado (3-6 meses de despesas)",
        "Há oportunidade de economia em gastos com Utilidades"
      ],
      savingsOpportunities: 320.50,
      analysisDate: new Date().toISOString()
    };
    
    res.status(200).json({
      success: true,
      message: 'Análise financeira gerada com sucesso',
      data: analysisData
    });
  } catch (error) {
    console.error('Erro ao gerar análise financeira:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao gerar análise financeira',
      error: error.message
    });
  }
});

module.exports = router;
