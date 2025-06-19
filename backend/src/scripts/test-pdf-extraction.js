/**
 * Script para testar a extração de texto de PDFs
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Função para testar a extração de texto de PDFs
async function testPdfExtraction(pdfPath) {
  try {
    console.log(`Testando extração de texto do PDF: ${pdfPath}`);
    
    // Verificar se o arquivo existe
    try {
      await fs.access(pdfPath);
      console.log('Arquivo encontrado');
    } catch (error) {
      console.error('Arquivo não encontrado:', error);
      return;
    }
    
    // Testar com pdftotext
    try {
      console.log('\nTestando com pdftotext:');
      const outputPath = `${pdfPath}.txt`;
      await execPromise(`pdftotext -layout "${pdfPath}" "${outputPath}"`);
      
      const text = await fs.readFile(outputPath, 'utf8');
      console.log('Texto extraído:', text.substring(0, 200) + '...');
      
      await fs.unlink(outputPath); // Remover arquivo temporário
    } catch (error) {
      console.error('Erro ao extrair texto com pdftotext:', error);
    }
    
    // Testar com pdftoppm + tesseract
    try {
      console.log('\nTestando com pdftoppm + tesseract:');
      const imageBasePath = pdfPath.replace('.pdf', '');
      await execPromise(`pdftoppm -png -r 300 -f 1 -l 1 "${pdfPath}" "${imageBasePath}"`);
      
      const imagePath = `${imageBasePath}-1.png`;
      
      try {
        await fs.access(imagePath);
        console.log('Imagem gerada com sucesso:', imagePath);
        
        // Usar tesseract para extrair texto da imagem
        const { stdout } = await execPromise(`tesseract "${imagePath}" stdout -l por`);
        console.log('Texto extraído:', stdout.substring(0, 200) + '...');
        
        await fs.unlink(imagePath); // Remover arquivo temporário
      } catch (error) {
        console.error('Erro ao processar imagem:', error);
      }
    } catch (error) {
      console.error('Erro ao converter PDF para imagem:', error);
    }
    
    // Testar OCR direto no PDF
    try {
      console.log('\nTestando OCR direto no PDF:');
      const { stdout } = await execPromise(`tesseract "${pdfPath}" stdout -l por pdf`);
      console.log('Texto extraído:', stdout.substring(0, 200) + '...');
    } catch (error) {
      console.error('Erro ao extrair texto com OCR direto no PDF:', error);
    }
    
    console.log('\nTestes concluídos!');
  } catch (error) {
    console.error('Erro ao testar extração de texto:', error);
  }
}

// Verificar argumentos da linha de comando
const pdfPath = process.argv[2];
if (!pdfPath) {
  console.error('Por favor, forneça o caminho para um arquivo PDF:');
  console.error('node test-pdf-extraction.js /caminho/para/arquivo.pdf');
  process.exit(1);
}

// Executar o teste
testPdfExtraction(pdfPath);
