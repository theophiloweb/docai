/**
 * Script simples para testar OCR usando comandos do sistema
 */

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const fs = require('fs').promises;
const path = require('path');

async function testOCR(filePath) {
  try {
    console.log(`Testando OCR para o arquivo: ${filePath}`);
    
    // Verificar se o arquivo existe
    try {
      await fs.access(filePath);
      console.log('Arquivo encontrado');
    } catch (error) {
      console.error('Arquivo não encontrado:', error);
      return;
    }
    
    // Verificar o tipo de arquivo
    const fileExt = path.extname(filePath).toLowerCase();
    
    if (fileExt === '.pdf') {
      console.log('Arquivo PDF detectado');
      
      // Testar com pdftotext
      try {
        console.log('\nTestando com pdftotext:');
        const { stdout, stderr } = await execPromise(`pdftotext -layout "${filePath}" -`);
        
        if (stderr) {
          console.error('Erro:', stderr);
        }
        
        if (stdout) {
          console.log('Texto extraído:', stdout.substring(0, 200) + '...');
          console.log(`Total de caracteres: ${stdout.length}`);
        } else {
          console.log('Nenhum texto extraído');
        }
      } catch (error) {
        console.error('Erro ao executar pdftotext:', error);
      }
      
      // Testar com pdftoppm + tesseract
      try {
        console.log('\nTestando com pdftoppm + tesseract:');
        const tempImagePath = `${filePath}.png`;
        
        // Converter apenas a primeira página
        await execPromise(`pdftoppm -png -f 1 -l 1 "${filePath}" "${filePath}"`);
        
        // Encontrar o arquivo gerado
        const dir = path.dirname(filePath);
        const baseName = path.basename(filePath, '.pdf');
        const files = await fs.readdir(dir);
        const pngFile = files.find(f => f.startsWith(baseName) && f.endsWith('.png'));
        
        if (pngFile) {
          const fullPngPath = path.join(dir, pngFile);
          console.log(`Imagem gerada: ${fullPngPath}`);
          
          // Executar tesseract
          const { stdout, stderr } = await execPromise(`tesseract "${fullPngPath}" stdout -l por`);
          
          if (stderr) {
            console.error('Erro:', stderr);
          }
          
          if (stdout) {
            console.log('Texto extraído:', stdout.substring(0, 200) + '...');
            console.log(`Total de caracteres: ${stdout.length}`);
          } else {
            console.log('Nenhum texto extraído');
          }
          
          // Limpar arquivo temporário
          await fs.unlink(fullPngPath);
        } else {
          console.log('Nenhuma imagem gerada');
        }
      } catch (error) {
        console.error('Erro ao executar pdftoppm + tesseract:', error);
      }
    } else if (['.jpg', '.jpeg', '.png', '.gif', '.bmp'].includes(fileExt)) {
      console.log('Arquivo de imagem detectado');
      
      // Testar com tesseract
      try {
        console.log('\nTestando com tesseract:');
        const { stdout, stderr } = await execPromise(`tesseract "${filePath}" stdout -l por`);
        
        if (stderr) {
          console.error('Erro:', stderr);
        }
        
        if (stdout) {
          console.log('Texto extraído:', stdout.substring(0, 200) + '...');
          console.log(`Total de caracteres: ${stdout.length}`);
        } else {
          console.log('Nenhum texto extraído');
        }
      } catch (error) {
        console.error('Erro ao executar tesseract:', error);
      }
    } else {
      console.log(`Tipo de arquivo não suportado: ${fileExt}`);
    }
    
    console.log('\nTeste concluído!');
  } catch (error) {
    console.error('Erro ao testar OCR:', error);
  }
}

// Verificar argumentos da linha de comando
const filePath = process.argv[2];
if (!filePath) {
  console.error('Por favor, forneça o caminho para um arquivo:');
  console.error('node simple-ocr-test.js /caminho/para/arquivo.pdf');
  process.exit(1);
}

// Executar o teste
testOCR(filePath);
