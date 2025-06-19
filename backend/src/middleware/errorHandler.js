/**
 * Middleware de tratamento de erros
 * 
 * Este middleware centraliza o tratamento de erros da aplicação,
 * garantindo respostas consistentes e seguras.
 * 
 * @author Doc.AI Team
 */

const logger = require('../utils/logger');

/**
 * Middleware de tratamento de erros
 * 
 * @param {Error} err - Objeto de erro
 * @param {Request} req - Objeto de requisição Express
 * @param {Response} res - Objeto de resposta Express
 * @param {Function} next - Função next do Express
 */
const errorHandler = (err, req, res, next) => {
  // Registrar o erro no log
  logger.error(`${err.name}: ${err.message}`, {
    method: req.method,
    path: req.path,
    ip: req.ip,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  // Determinar o código de status HTTP
  let statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  
  // Ajustar o código de status com base no tipo de erro
  if (err.name === 'ValidationError') {
    statusCode = 400;
  } else if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
    statusCode = 401;
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
  } else if (err.name === 'ConflictError') {
    statusCode = 409;
  } else if (err.name === 'RateLimitError') {
    statusCode = 429;
  }

  // Preparar a resposta de erro
  const errorResponse = {
    success: false,
    status: statusCode,
    message: err.message || 'Erro interno do servidor',
    errors: err.errors || undefined
  };

  // Em ambiente de desenvolvimento, incluir mais detalhes
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  // Enviar resposta de erro
  res.status(statusCode).json(errorResponse);
};

// Classes de erro personalizadas para uso em toda a aplicação

class ValidationError extends Error {
  constructor(message, errors = []) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

class UnauthorizedError extends Error {
  constructor(message = 'Não autorizado') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

class ForbiddenError extends Error {
  constructor(message = 'Acesso negado') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

class NotFoundError extends Error {
  constructor(message = 'Recurso não encontrado') {
    super(message);
    this.name = 'NotFoundError';
  }
}

class ConflictError extends Error {
  constructor(message = 'Conflito de recursos') {
    super(message);
    this.name = 'ConflictError';
  }
}

class RateLimitError extends Error {
  constructor(message = 'Limite de requisições excedido') {
    super(message);
    this.name = 'RateLimitError';
  }
}

module.exports = {
  errorHandler,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  RateLimitError
};
