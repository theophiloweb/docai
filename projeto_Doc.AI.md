# Projeto Doc.AI - Sistema de Gerenciamento Inteligente de Documentos Pessoais

<div align="center">
  <img src="frontend/src/assets/images/logo.svg" alt="Doc.AI Logo" width="300">
</div>

**Apresentado por:** Teophilo Silva e Willame Oliveira  
**Projeto:** Geração Tech 2.0 - Digital College, Fortaleza-CE

## Sumário

1. [Visão Geral](#visão-geral)
2. [Tecnologias Utilizadas](#tecnologias-utilizadas)
3. [Arquitetura do Sistema](#arquitetura-do-sistema)
4. [Análise dos Requisitos do Frontend](#análise-dos-requisitos-do-frontend)
5. [Análise dos Requisitos do Backend](#análise-dos-requisitos-do-backend)
6. [Demonstração de Funcionalidades](#demonstração-de-funcionalidades)
7. [Desafios e Soluções](#desafios-e-soluções)
8. [Conclusão](#conclusão)

## Visão Geral

Doc.AI é uma plataforma inovadora para gerenciamento de documentos pessoais com recursos avançados de inteligência artificial. O sistema permite que usuários façam upload, organizem e obtenham insights valiosos de seus documentos pessoais em diversas categorias (saúde, finanças, orçamentos, etc.).

Diferente de serviços tradicionais de armazenamento em nuvem como Google Drive ou Microsoft OneDrive, o Doc.AI utiliza tecnologias de IA para extrair informações relevantes dos documentos, categorizá-los automaticamente e gerar insights personalizados que ajudam os usuários a tomar decisões mais informadas.

### Principais Recursos

- **Upload e processamento inteligente de documentos** com extração automática de texto via OCR
- **Categorização automática** de documentos por IA
- **Dashboards especializados** para diferentes tipos de documentos (médicos, financeiros, orçamentos)
- **Geração de insights personalizados** usando modelos avançados de IA (Llama 4)
- **Interface responsiva e intuitiva** com suporte a múltiplos idiomas
- **Segurança e privacidade** em conformidade com a LGPD

## Tecnologias Utilizadas

### Frontend

- **Framework:** React.js 18
- **Roteamento:** React Router 6
- **Estilização:** Tailwind CSS
- **Gerenciamento de Estado:** Context API
- **Formulários:** Formik com Yup
- **Internacionalização:** i18next (pt-BR e en-US)
- **Visualização de Dados:** Chart.js
- **Requisições HTTP:** Axios

### Backend

- **Linguagem:** Node.js v18
- **Framework:** Express.js
- **Banco de Dados:** PostgreSQL 15
- **ORM:** Sequelize
- **Autenticação:** JWT (JSON Web Tokens)
- **Processamento de Documentos:** Tesseract.js para OCR
- **Logs:** Winston
- **Validação:** Joi

### Inteligência Artificial

- **Motor de IA:** Integração com Llama 4 via OpenRouter
- **OCR:** Tesseract.js e CLI tools (pdftotext, ImageMagick)
- **Análise de Texto:** Processamento de linguagem natural
- **Categorização:** Algoritmos de classificação de texto

## Arquitetura do Sistema

O Doc.AI segue uma arquitetura MVC (Model-View-Controller) com separação clara entre frontend e backend:

### Estrutura do Frontend

```
frontend/
├── public/                # Arquivos públicos
└── src/
    ├── assets/            # Imagens e recursos estáticos
    ├── components/        # Componentes React reutilizáveis
    │   ├── admin/         # Componentes da área administrativa
    │   ├── budget/        # Componentes de orçamentos
    │   ├── common/        # Componentes comuns
    │   ├── documents/     # Componentes de documentos
    │   └── layout/        # Componentes de layout
    ├── context/           # Contextos React (Auth, I18n, Theme)
    ├── hooks/             # Hooks personalizados
    ├── layouts/           # Layouts de página
    ├── locales/           # Arquivos de tradução
    ├── pages/             # Páginas da aplicação
    │   ├── admin/         # Páginas administrativas
    │   ├── auth/          # Páginas de autenticação
    │   └── dashboard/     # Páginas de dashboard
    ├── services/          # Serviços (API, IA)
    └── utils/             # Funções utilitárias
```

### Estrutura do Backend

```
backend/
├── src/
│   ├── config/            # Configurações (banco de dados, etc.)
│   ├── controllers/       # Controladores da API
│   ├── database/          # Scripts de seed e migrações
│   ├── middleware/        # Middlewares (autenticação, etc.)
│   ├── models/            # Modelos do Sequelize
│   ├── routes/            # Rotas da API
│   ├── services/          # Serviços (OCR, IA)
│   ├── utils/             # Funções utilitárias
│   └── server.js          # Ponto de entrada do servidor
├── uploads/               # Documentos enviados pelos usuários
└── logs/                  # Logs do sistema
```

### Fluxo de Dados

1. O usuário faz upload de um documento
2. O backend processa o documento com OCR para extrair texto
3. A IA analisa o conteúdo e categoriza o documento
4. Os dados extraídos são armazenados no banco de dados
5. O frontend exibe o documento processado com insights gerados pela IA
6. O usuário pode interagir com os insights e gerenciar seus documentos

## Análise dos Requisitos do Frontend

### 1. Componentização

O Doc.AI implementa uma estrutura de componentes altamente modular e reutilizável:

- **Componentes Base:** Botões, inputs, cards, modais, etc.
- **Componentes Compostos:** Formulários, tabelas, gráficos, etc.
- **Componentes de Página:** Específicos para cada seção da aplicação

**Exemplos de Componentes Reutilizáveis:**

- `BudgetGroupList.js`: Componente para exibir grupos de orçamentos com análise de IA
- `DocumentUploadModal.js`: Modal reutilizável para upload de documentos
- `StatusBadge.js`: Componente para exibir status com cores diferentes

### 2. Uso de Router

O sistema implementa o React Router 6 para navegação entre páginas:

```javascript
// Exemplo de configuração de rotas
<Routes>
  {/* Rotas públicas */}
  <Route path="/" element={<LandingLayout />}>
    <Route index element={<HomePage />} />
    <Route path="about" element={<AboutPage />} />
    <Route path="contact" element={<ContactPage />} />
    <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
    <Route path="terms-of-service" element={<TermsOfServicePage />} />
  </Route>

  {/* Rotas de autenticação */}
  <Route path="/auth" element={<AuthLayout />}>
    <Route path="login" element={<LoginPage />} />
    <Route path="register" element={<RegisterPage />} />
    <Route path="forgot-password" element={<ForgotPasswordPage />} />
    <Route path="reset-password/:token" element={<ResetPasswordPage />} />
  </Route>

  {/* Rotas protegidas */}
  <Route path="/dashboard" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
    <Route index element={<DashboardPage />} />
    <Route path="documents" element={<DocumentsPage />} />
    <Route path="documents/:id" element={<DocumentDetailPage />} />
    <Route path="medical" element={<MedicalHistoryPage />} />
    <Route path="financial" element={<FinancialPage />} />
    <Route path="budget" element={<BudgetPage />} />
    <Route path="profile" element={<ProfilePage />} />
    <Route path="settings" element={<SettingsPage />} />
  </Route>
</Routes>
```

### 3. Uso de Hooks

O Doc.AI utiliza extensivamente os hooks do React para gerenciamento de estado e efeitos colaterais:

#### useState

```javascript
// Exemplo de useState no componente BudgetPage
const [loading, setLoading] = useState(true);
const [budgetData, setBudgetData] = useState(null);
const [filteredRecords, setFilteredRecords] = useState([]);
const [statusFilter, setStatusFilter] = useState('all');
const [categoryFilter, setCategoryFilter] = useState('all');
```

#### useEffect

```javascript
// Exemplo de useEffect para carregar dados
useEffect(() => {
  const fetchBudgetData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/budget/dashboard');
      setBudgetData(response.data.data);
      setFilteredRecords(response.data.data.records || []);
    } catch (error) {
      console.error('Erro ao carregar dados de orçamentos:', error);
    } finally {
      setLoading(false);
    }
  };
  
  fetchBudgetData();
}, []);

// Exemplo de useEffect para aplicar filtros
useEffect(() => {
  if (!budgetData?.records) return;
  
  let filtered = [...budgetData.records];
  
  if (statusFilter !== 'all') {
    filtered = filtered.filter(record => record.status === statusFilter);
  }
  
  if (categoryFilter !== 'all') {
    filtered = filtered.filter(record => record.category === categoryFilter);
  }
  
  setFilteredRecords(filtered);
}, [statusFilter, categoryFilter, budgetData]);
```

#### Hooks Personalizados

Criamos hooks personalizados para lógicas reutilizáveis:

```javascript
// Hook personalizado para tradução automática
const useAutoTranslate = (text, targetLanguage) => {
  const [translatedText, setTranslatedText] = useState(text);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const translateText = async () => {
      if (!text) return;
      
      try {
        setLoading(true);
        const result = await translateService.translate(text, targetLanguage);
        setTranslatedText(result);
      } catch (err) {
        setError(err);
        setTranslatedText(text); // Fallback para o texto original
      } finally {
        setLoading(false);
      }
    };
    
    translateText();
  }, [text, targetLanguage]);

  return { translatedText, loading, error };
};
```

### 4. Layout

O Doc.AI implementa layouts responsivos e intuitivos para todas as páginas principais:

#### Página Home

A página inicial apresenta os principais recursos do sistema, com seções para:
- Hero com chamada para ação
- Recursos principais com ícones e descrições
- Seção de privacidade e segurança
- Depoimentos de usuários
- CTA final para registro

#### Página Listar Produtos (Documentos)

A página de listagem de documentos inclui:
- Filtros por categoria, data e status
- Opções de ordenação
- Visualização em lista ou grade
- Paginação para grandes volumes de documentos
- Botão de upload de novos documentos

#### Página Detalhe Produto (Documento)

A página de detalhes de documento mostra:
- Visualização do documento
- Metadados extraídos pela IA
- Insights gerados pela IA
- Histórico de versões
- Opções para editar, compartilhar ou excluir

### 5. Construção Lógica

#### Organização da Estrutura

O código do frontend segue uma estrutura organizada e modular:

- **Separação de Responsabilidades:** Cada componente tem uma função específica
- **Padrões Consistentes:** Nomenclatura e estrutura de arquivos padronizadas
- **Modularização:** Componentes pequenos e focados em uma única responsabilidade
- **Reutilização:** Componentes genéricos para reduzir duplicação de código

#### Performance

Implementamos diversas otimizações de performance:

- **Lazy Loading:** Carregamento sob demanda de componentes pesados
- **Memoização:** Uso de `useMemo` e `useCallback` para evitar recálculos desnecessários
- **Virtualização:** Renderização eficiente de listas longas
- **Code Splitting:** Divisão do código em chunks menores
- **Otimização de Imagens:** Uso de formatos modernos e carregamento progressivo

### 6. Trabalho em Equipe

#### Colaboração Distribuída

Nossa equipe trabalhou de forma distribuída utilizando:

- **Reuniões Diárias:** Sincronização rápida sobre o progresso
- **Documentação Compartilhada:** Wiki com padrões e decisões de design
- **Revisão de Código:** Revisão por pares para garantir qualidade
- **Ferramentas de Comunicação:** Slack para comunicação assíncrona

#### Organização das Branches

Adotamos o modelo GitFlow para gerenciamento de código:

- **main:** Código de produção estável
- **develop:** Branch de integração para desenvolvimento
- **feature/\*:** Branches para novas funcionalidades
- **bugfix/\*:** Branches para correção de bugs
- **release/\*:** Branches para preparação de releases

### 7. Documentação

O projeto mantém documentação abrangente:

- **README.md:** Visão geral do projeto e instruções de instalação
- **DOCUMENTACAO_TECNICA.md:** Detalhes técnicos da implementação
- **INTEGRACAO_IA.md:** Documentação específica da integração com IA
- **DASHBOARDS_ESPECIALIZADOS.md:** Detalhes sobre os dashboards
- **JSDoc:** Documentação de código em componentes e funções

### 8. Extras

#### Bibliotecas

Utilizamos bibliotecas externas para adicionar funcionalidades:

- **Chart.js:** Visualização de dados em gráficos
- **i18next:** Internacionalização
- **Formik + Yup:** Validação de formulários
- **Axios:** Requisições HTTP
- **Tailwind CSS:** Estilização

#### Consumo de API

Implementamos um serviço centralizado para comunicação com o backend:

```javascript
// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Redirecionar para login em caso de token expirado
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

#### Deploy

O frontend foi configurado para deploy automático, com:

- **Build Otimizado:** Minificação e tree-shaking
- **Versionamento de Assets:** Cache-busting para atualizações
- **Configuração de CORS:** Segurança para comunicação com o backend
- **Variáveis de Ambiente:** Configuração para diferentes ambientes

## Análise dos Requisitos do Backend

### 1. Token JWT

O Doc.AI implementa autenticação segura com JWT:

```javascript
// middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    // Verificar se o token está presente no header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Acesso não autorizado. Token não fornecido.'
      });
    }

    // Extrair o token
    const token = authHeader.split(' ')[1];

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar o usuário no banco de dados
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado.'
      });
    }

    // Adicionar o usuário ao objeto de requisição
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado. Por favor, faça login novamente.'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Token inválido.'
    });
  }
};

module.exports = authMiddleware;
```

### 2. Segurança

#### Dotenv

O sistema utiliza variáveis de ambiente para proteger informações sensíveis:

```javascript
// .env
PORT=3001
NODE_ENV=development

# Configurações do Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=1234
DB_NAME=docai

# Configurações de JWT
JWT_SECRET=docai-super-secret-key-change-in-production
JWT_EXPIRES_IN=1d

# Configurações de API de IA
AI_API_KEY=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
AI_API_URL=https://openrouter.ai/api/v1
AI_PROVIDER=openrouter
AI_MODEL=meta-llama/llama-4-maverick:free
```

```javascript
// Carregamento das variáveis de ambiente
require('dotenv').config();

// Uso das variáveis
const port = process.env.PORT || 3000;
const jwtSecret = process.env.JWT_SECRET;
```

### 3. Banco de Dados

#### Criação de Tabelas

O Doc.AI utiliza o Sequelize ORM para definir modelos que são mapeados para tabelas no banco de dados:

```javascript
// models/Document.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Document = sequelize.define('Document', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // ... outros campos
}, {
  tableName: 'Documents',
  underscored: true
});

module.exports = Document;
```

#### CRUD

O sistema implementa operações CRUD completas para todas as entidades:

```javascript
// controllers/document.processing.controller.js
// Exemplo de operações CRUD para documentos

// Create
exports.uploadDocument = async (req, res) => {
  try {
    // Lógica para criar um novo documento
    const document = await Document.create({
      userId: req.user.id,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileSize: req.file.size
    });
    
    return res.status(201).json({
      success: true,
      message: 'Documento enviado com sucesso',
      data: document
    });
  } catch (error) {
    // Tratamento de erro
  }
};

// Read
exports.getDocuments = async (req, res) => {
  try {
    // Lógica para listar documentos
    const documents = await Document.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    
    return res.status(200).json({
      success: true,
      data: documents
    });
  } catch (error) {
    // Tratamento de erro
  }
};

// Update
exports.updateDocument = async (req, res) => {
  try {
    // Lógica para atualizar um documento
    const document = await Document.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Documento não encontrado'
      });
    }
    
    await document.update({
      title: req.body.title || document.title,
      description: req.body.description || document.description,
      category: req.body.category || document.category
    });
    
    return res.status(200).json({
      success: true,
      message: 'Documento atualizado com sucesso',
      data: document
    });
  } catch (error) {
    // Tratamento de erro
  }
};

// Delete
exports.deleteDocument = async (req, res) => {
  try {
    // Lógica para excluir um documento
    const document = await Document.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Documento não encontrado'
      });
    }
    
    await document.destroy();
    
    return res.status(200).json({
      success: true,
      message: 'Documento excluído com sucesso'
    });
  } catch (error) {
    // Tratamento de erro
  }
};
```

#### Sequelize

O Doc.AI utiliza o Sequelize como ORM para interagir com o banco de dados PostgreSQL:

```javascript
// config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      timestamps: true,
      underscored: true
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Testar conexão
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  } catch (error) {
    console.error('Não foi possível conectar ao banco de dados:', error);
  }
};

module.exports = { sequelize, testConnection };
```

### 4. Construção Lógica

#### Arquitetura MVC

O backend segue rigorosamente o padrão MVC:

- **Models:** Definição da estrutura de dados e relacionamentos
- **Views:** Representadas pelas respostas JSON da API
- **Controllers:** Lógica de negócios e manipulação de requisições

```
src/
├── models/          # Definição dos modelos de dados (M)
├── controllers/     # Lógica de negócios e manipulação de requisições (C)
├── routes/          # Definição das rotas da API
└── services/        # Serviços compartilhados entre controllers
```

#### Performance

O backend implementa diversas otimizações de performance:

- **Indexação:** Índices em colunas frequentemente consultadas
- **Paginação:** Resultados paginados para grandes conjuntos de dados
- **Caching:** Cache de resultados frequentes
- **Processamento Assíncrono:** Tarefas pesadas executadas em background
- **Otimização de Consultas:** Consultas SQL otimizadas

### 5. Trabalho em Equipe

#### Colaboração Distribuída

A equipe de backend trabalhou de forma coordenada:

- **Padrões de Código:** ESLint e Prettier para manter consistência
- **Revisão de Código:** Pull requests revisados por pelo menos um membro da equipe
- **Documentação Inline:** Comentários JSDoc para funções e classes
- **Testes Automatizados:** Cobertura de testes para funcionalidades críticas

#### Organização das Branches

Seguimos o mesmo modelo GitFlow do frontend:

- **main:** Código de produção estável
- **develop:** Branch de integração para desenvolvimento
- **feature/\*:** Branches para novas funcionalidades
- **bugfix/\*:** Branches para correção de bugs
- **release/\*:** Branches para preparação de releases

### 6. Documentação

O backend mantém documentação abrangente:

- **Comentários JSDoc:** Documentação inline para funções e classes
- **README.md:** Instruções de instalação e configuração
- **API Docs:** Documentação das rotas e parâmetros
- **Arquivos .md:** Documentação detalhada de componentes específicos

### 7. Extras

#### Middleware

O sistema utiliza diversos middlewares para interceptar e manipular requisições:

```javascript
// middleware/upload.middleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Configuração de armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', '..', process.env.UPLOAD_DIR);
    
    // Criar diretório se não existir
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Gerar nome único para o arquivo
    const uniqueFilename = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueFilename);
  }
});

// Filtro de arquivos
const fileFilter = (req, file, cb) => {
  // Tipos de arquivo permitidos
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não suportado'), false);
  }
};

// Configuração do multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB por padrão
  }
});

module.exports = upload;
```

#### Migrations

O sistema utiliza migrations do Sequelize para gerenciar alterações no esquema do banco de dados:

```javascript
// Exemplo de migration para adicionar colunas à tabela BudgetRecords
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('BudgetRecords', 'delivery_time', {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'Tempo de entrega em dias'
    });
    
    await queryInterface.addColumn('BudgetRecords', 'warranty', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Período de garantia (ex: "12 meses")'
    });
    
    await queryInterface.addColumn('BudgetRecords', 'warranty_months', {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'Período de garantia em meses para facilitar comparações'
    });
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('BudgetRecords', 'delivery_time');
    await queryInterface.removeColumn('BudgetRecords', 'warranty');
    await queryInterface.removeColumn('BudgetRecords', 'warranty_months');
  }
};
```

#### Deploy

O backend foi configurado para deploy em ambiente de produção:

- **PM2:** Gerenciamento de processos Node.js
- **Nginx:** Proxy reverso e balanceamento de carga
- **Docker:** Containerização para facilitar implantação
- **CI/CD:** Pipeline de integração e entrega contínua

## Demonstração de Funcionalidades

### 1. Upload e Processamento de Documentos

O Doc.AI permite o upload de documentos em diversos formatos (PDF, imagens, etc.) e utiliza OCR para extrair texto automaticamente:

1. O usuário seleciona um arquivo para upload
2. O sistema verifica o tipo e tamanho do arquivo
3. O arquivo é enviado para o servidor
4. O backend processa o documento com OCR para extrair texto
5. A IA analisa o conteúdo e categoriza o documento
6. Os dados extraídos são apresentados ao usuário para confirmação
7. Após confirmação, o documento é salvo no banco de dados

### 2. Dashboards Especializados

O sistema oferece dashboards específicos para diferentes tipos de documentos:

#### Dashboard Médico

- Resumo de consultas, exames e medicamentos
- Gráficos de evolução de sinais vitais
- Gráficos de resultados de exames laboratoriais
- Análise de tendências e recomendações por IA
- Alertas sobre consultas de acompanhamento necessárias

#### Dashboard Financeiro

- Resumo de receitas e despesas
- Gráficos de fluxo de caixa
- Análise de gastos por categoria
- Tendências de gastos ao longo do tempo
- Recomendações para otimização financeira

#### Dashboard de Orçamentos

- Comparação de orçamentos para o mesmo produto/serviço
- Análise de custo-benefício por IA
- Recomendações baseadas em preço, reputação e outros fatores
- Alertas sobre orçamentos prestes a expirar
- Visualização de tendências de preços

### 3. Integração com IA

O Doc.AI utiliza o modelo Llama 4 via OpenRouter para gerar insights personalizados:

1. O sistema extrai informações relevantes dos documentos
2. Os dados são enviados para a API do OpenRouter com prompts específicos
3. O modelo Llama 4 analisa os dados e gera insights
4. Os insights são processados e formatados pelo backend
5. O frontend exibe os insights de forma clara e acionável

## Desafios e Soluções

### Desafios Técnicos

1. **Extração precisa de texto de documentos com diferentes layouts e qualidades**
   - **Solução:** Implementamos um pipeline de OCR com múltiplas abordagens (pdftotext, Tesseract) e pré-processamento de imagens com ImageMagick

2. **Categorização automática precisa de documentos com conteúdo ambíguo**
   - **Solução:** Utilizamos o modelo Llama 4 com prompts específicos para classificação de documentos

3. **Balanceamento entre precisão e performance nos algoritmos de processamento**
   - **Solução:** Implementamos processamento assíncrono e limitamos o tamanho do texto enviado para análise

4. **Implementação de criptografia que não comprometa a funcionalidade de busca**
   - **Solução:** Utilizamos criptografia por campo com suporte a busca em texto cifrado

### Desafios de Implementação

1. **Internacionalização completa da aplicação**
   - **Solução:** Implementamos o i18next com detecção automática de idioma e tradução de todos os textos

2. **Integração entre diferentes dashboards**
   - **Solução:** Criamos um sistema de navegação intuitivo e referências cruzadas entre dashboards

3. **Otimização de performance para grandes volumes de documentos**
   - **Solução:** Implementamos paginação, virtualização e carregamento sob demanda

## Conclusão

O Doc.AI representa uma solução inovadora para o gerenciamento de documentos pessoais, combinando tecnologias modernas de frontend e backend com recursos avançados de inteligência artificial. O sistema atende a todos os requisitos estabelecidos para o projeto, demonstrando a aplicação prática dos conhecimentos adquiridos durante o curso de desenvolvimento FullStack.

A arquitetura modular, o uso de componentes reutilizáveis, a implementação de rotas para navegação, o gerenciamento eficiente de estado com hooks, e a integração com APIs externas demonstram o domínio das tecnologias frontend. No backend, a implementação de autenticação JWT, o uso de variáveis de ambiente para segurança, a modelagem de dados com Sequelize, e a arquitetura MVC evidenciam a aplicação dos conceitos de desenvolvimento de servidor.

O projeto não apenas cumpre os requisitos técnicos, mas também oferece uma solução real para um problema comum: a organização e extração de valor de documentos pessoais. A integração com IA para geração de insights representa um diferencial significativo em relação a soluções tradicionais de armazenamento de documentos.

Como próximos passos, planejamos expandir as funcionalidades do sistema, melhorar a precisão dos algoritmos de IA, e implementar recursos adicionais de colaboração e compartilhamento seguro de documentos.

---

**Equipe de Desenvolvimento:**  
Teophilo Silva e Willame Oliveira

**Projeto Final - Geração Tech 2.0**  
Digital College, Fortaleza-CE