/**
 * Script para testar o módulo llama-ocr
 */

const { extractText } = require('llama-ocr');
const fs = require('fs');
const path = require('path');

// Função para testar o módulo llama-ocr
async function testLlamaOCR() {
  try {
    console.log('Testando o módulo llama-ocr...');
    
    // Verificar se o módulo está instalado corretamente
    console.log('Versão do llama-ocr:', require('llama-ocr/package.json').version);
    
    // Verificar se o método extractText está disponível
    console.log('Método extractText disponível:', typeof extractText === 'function');
    
    console.log('Teste concluído com sucesso!');
  } catch (error) {
    console.error('Erro ao testar o módulo llama-ocr:', error);
  }
}

// Executar o teste
testLlamaOCR();
