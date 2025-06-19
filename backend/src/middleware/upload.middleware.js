/**
 * Middleware de Upload de Arquivos
 * 
 * Este middleware configura o multer para lidar com o upload de arquivos.
 * 
 * @author Doc.AI Team
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Garantir que o diretório de uploads temporários exista
const tempDir = path.join(__dirname, '../../temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Configurar armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    // Gerar nome de arquivo único
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

// Filtrar arquivos permitidos
const fileFilter = (req, file, cb) => {
  // Tipos de arquivo permitidos
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não permitido'), false);
  }
};

// Configurar multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

module.exports = upload;
