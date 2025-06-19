/**
 * Seeder de Logs
 * 
 * Este arquivo cria logs fictícios para testes.
 * 
 * @author Doc.AI Team
 */

const { Log, User } = require('../../models');
const logger = require('../../utils/logger');

const createLogs = async () => {
  try {
    // Obter usuários para associar aos logs
    const users = await User.findAll();
    const userMap = {};
    users.forEach(user => {
      userMap[user.email] = user;
    });

    // Criar logs fictícios
    const logs = [
      // Logs de autenticação
      {
        userId: userMap['admin@docai.com.br'].id,
        type: 'auth',
        level: 'info',
        message: 'Login bem-sucedido',
        details: { ip: '192.168.1.1' },
        ip: '192.168.1.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      {
        userId: userMap['cliente@exemplo.com'].id,
        type: 'auth',
        level: 'info',
        message: 'Login bem-sucedido',
        details: { ip: '192.168.1.2' },
        ip: '192.168.1.2',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15'
      },
      {
        type: 'auth',
        level: 'error',
        message: 'Tentativa de login falhou: credenciais inválidas',
        details: { email: 'usuario.inexistente@exemplo.com', ip: '192.168.1.3' },
        ip: '192.168.1.3',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
      },
      
      // Logs de documentos
      {
        userId: userMap['cliente@exemplo.com'].id,
        type: 'document',
        level: 'info',
        message: 'Documento criado: Exame de Sangue',
        details: { documentId: 'doc-123', category: 'saude' },
        ip: '192.168.1.2',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15'
      },
      {
        userId: userMap['maria@exemplo.com'].id,
        type: 'document',
        level: 'info',
        message: 'Documento atualizado: Contrato de Aluguel',
        details: { documentId: 'doc-456', category: 'juridico' },
        ip: '192.168.1.4',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      {
        userId: userMap['joao@exemplo.com'].id,
        type: 'document',
        level: 'info',
        message: 'Documento excluído: Nota Fiscal',
        details: { documentId: 'doc-789', category: 'financeiro' },
        ip: '192.168.1.5',
        userAgent: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0'
      },
      
      // Logs de sistema
      {
        type: 'system',
        level: 'warning',
        message: 'Uso de CPU acima de 80%',
        details: { cpu: 85, memory: 70, disk: 60 }
      },
      {
        type: 'system',
        level: 'error',
        message: 'Falha na conexão com o banco de dados',
        details: { error: 'Connection timeout', retries: 3 }
      },
      {
        type: 'system',
        level: 'info',
        message: 'Backup diário concluído com sucesso',
        details: { size: '1.2GB', duration: '00:05:23', files: 1250 }
      },
      
      // Logs de segurança
      {
        type: 'security',
        level: 'warning',
        message: 'Múltiplas tentativas de login falhas para o mesmo usuário',
        details: { email: 'maria@exemplo.com', attempts: 5, ip: '192.168.1.10' },
        ip: '192.168.1.10'
      },
      {
        type: 'security',
        level: 'error',
        message: 'Tentativa de acesso não autorizado detectada',
        details: { endpoint: '/api/admin/users', ip: '192.168.1.11', method: 'GET' },
        ip: '192.168.1.11',
        userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
      },
      
      // Logs de IA
      {
        userId: userMap['cliente@exemplo.com'].id,
        type: 'ai',
        level: 'info',
        message: 'Análise de documento concluída',
        details: { documentId: 'doc-123', model: 'gpt-4', processingTime: '2.3s' },
        ip: '192.168.1.2'
      },
      {
        userId: userMap['fernanda@exemplo.com'].id,
        type: 'ai',
        level: 'error',
        message: 'Falha na análise de documento',
        details: { documentId: 'doc-321', model: 'claude-3', error: 'Timeout' },
        ip: '192.168.1.6'
      }
    ];

    for (const log of logs) {
      await Log.create(log);
    }

    logger.info('Logs criados com sucesso!');
  } catch (error) {
    logger.error('Erro ao criar logs:', error);
  }
};

module.exports = createLogs;
