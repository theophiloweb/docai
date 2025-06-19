# Guia de Desenvolvimento - Doc.AI

Este guia fornece instruções detalhadas para desenvolvedores que desejam contribuir com o projeto Doc.AI.

## Configuração do Ambiente de Desenvolvimento

### Pré-requisitos

- Node.js v16 ou superior
- PostgreSQL 13 ou superior
- Git
- Editor de código (recomendado: Visual Studio Code)

### Configuração Inicial

1. Clone o repositório:
   ```bash
   git clone https://github.com/sua-organizacao/docai.git
   cd docai
   ```

2. Instale as dependências do backend:
   ```bash
   cd backend
   npm install
   ```

3. Instale as dependências do frontend:
   ```bash
   cd ../frontend
   npm install
   ```

4. Configure o banco de dados:
   ```bash
   # Crie o banco de dados
   createdb docai

   # Execute as migrações (a partir da pasta backend)
   cd ../backend
   npm run seed
   ```

5. Configure os arquivos de ambiente:
   
   **Backend (.env)**:
   ```
   PORT=3001
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=admin
   DB_PASSWORD=1234
   DB_NAME=docai
   JWT_SECRET=docai-super-secret-key-change-in-production
   JWT_EXPIRES_IN=1d
   JWT_REFRESH_SECRET=docai-refresh-super-secret-key-change-in-production
   JWT_REFRESH_EXPIRES_IN=7d
   UPLOAD_DIR=uploads
   MAX_FILE_SIZE=10485760
   AI_API_KEY=your-ai-api-key
   AI_API_URL=https://api.openai.com/v1
   LOG_LEVEL=info
   ```

   **Frontend (.env)**:
   ```
   REACT_APP_API_URL=http://localhost:3001/api
   ```

6. Inicie o servidor de desenvolvimento:
   
   **Backend**:
   ```bash
   cd backend
   npm run dev
   ```

   **Frontend**:
   ```bash
   cd frontend
   npm start
   ```

## Estrutura do Projeto

### Backend

```
backend/
├── logs/                  # Logs do sistema
├── src/
│   ├── config/            # Configurações (banco de dados, etc.)
│   ├── controllers/       # Controladores da API
│   ├── database/          # Scripts de seed e migrações
│   ├── middleware/        # Middlewares (autenticação, etc.)
│   ├── models/            # Modelos do Sequelize
│   ├── routes/            # Rotas da API
│   ├── scripts/           # Scripts utilitários
│   ├── services/          # Serviços (OCR, etc.)
│   ├── utils/             # Funções utilitárias
│   └── server.js          # Ponto de entrada do servidor
├── tests/                 # Testes automatizados
└── uploads/               # Documentos enviados pelos usuários
```

### Frontend

```
frontend/
├── public/                # Arquivos públicos
└── src/
    ├── assets/            # Imagens e recursos estáticos
    ├── components/        # Componentes React reutilizáveis
    │   ├── admin/         # Componentes administrativos
    │   ├── budget/        # Componentes de orçamentos
    │   ├── common/        # Componentes comuns
    │   ├── documents/     # Componentes de documentos
    │   └── layout/        # Componentes de layout
    ├── context/           # Contextos React
    ├── hooks/             # Hooks personalizados
    ├── layouts/           # Layouts de página
    ├── locales/           # Arquivos de tradução
    ├── pages/             # Páginas da aplicação
    │   ├── admin/         # Páginas administrativas
    │   ├── auth/          # Páginas de autenticação
    │   └── dashboard/     # Páginas do dashboard
    ├── services/          # Serviços (API, etc.)
    └── utils/             # Funções utilitárias
```

## Fluxo de Trabalho de Desenvolvimento

### Branches

- `main`: Branch principal, contém código estável
- `develop`: Branch de desenvolvimento, contém código em teste
- `feature/*`: Branches para novas funcionalidades
- `bugfix/*`: Branches para correção de bugs
- `hotfix/*`: Branches para correções urgentes em produção

### Processo de Desenvolvimento

1. Crie uma nova branch a partir de `develop`:
   ```bash
   git checkout develop
   git pull
   git checkout -b feature/nova-funcionalidade
   ```

2. Implemente a funcionalidade ou correção

3. Execute os testes:
   ```bash
   # Backend
   cd backend
   npm test
   
   # Frontend
   cd frontend
   npm test
   ```

4. Faça commit das alterações:
   ```bash
   git add .
   git commit -m "Adiciona nova funcionalidade"
   ```

5. Envie a branch para o repositório remoto:
   ```bash
   git push origin feature/nova-funcionalidade
   ```

6. Crie um Pull Request para a branch `develop`

7. Após revisão e aprovação, faça o merge do Pull Request

## Padrões de Código

### Backend

- **Estilo de Código**: ESLint com configuração Airbnb
- **Formatação**: Prettier
- **Documentação**: JSDoc para funções e classes
- **Logs**: Utilize o logger centralizado (winston)
- **Tratamento de Erros**: Utilize try/catch e middleware de erro
- **Validação**: Utilize express-validator para validação de entrada

### Frontend

- **Estilo de Código**: ESLint com configuração Airbnb
- **Formatação**: Prettier
- **Componentes**: Utilize componentes funcionais com hooks
- **Estado**: Utilize Context API para estado global
- **Estilização**: Utilize Tailwind CSS
- **Internacionalização**: Utilize i18next para traduções

## Banco de Dados

### Modelos Principais

- **User**: Usuários do sistema
- **Admin**: Administradores do sistema
- **Client**: Clientes do sistema
- **Document**: Documentos enviados pelos usuários
- **MedicalRecord**: Dados extraídos de documentos médicos
- **FinancialRecord**: Dados extraídos de documentos financeiros
- **BudgetRecord**: Dados extraídos de orçamentos
- **AISettings**: Configurações dos provedores de IA
- **AIPrompt**: Prompts para geração de insights

### Migrações

Para criar uma nova migração:

1. Crie um arquivo de migração na pasta `backend/src/database/migrations`
2. Implemente as funções `up` e `down`
3. Execute a migração com `npm run migrate`

## API

### Autenticação

Todas as rotas protegidas requerem um token JWT no cabeçalho `Authorization`:

```
Authorization: Bearer <token>
```

### Formato de Resposta

Todas as respostas da API seguem o formato:

```json
{
  "success": true,
  "message": "Mensagem de sucesso",
  "data": {
    // Dados da resposta
  }
}
```

Em caso de erro:

```json
{
  "success": false,
  "message": "Mensagem de erro",
  "error": "Detalhes do erro (apenas em desenvolvimento)"
}
```

## Integração com IA

### Configuração de Provedores

Os provedores de IA são configurados na tabela `AISettings`. Para adicionar um novo provedor:

1. Acesse o painel administrativo
2. Navegue até "Configurações > IA"
3. Clique em "Adicionar Provedor"
4. Preencha os campos:
   - Provedor (ex: "llama", "openai", "anthropic")
   - Chave de API
   - URL da API
   - Modelo
   - Temperatura
   - Tokens máximos
5. Clique em "Salvar"

### Criação de Prompts

Os prompts para geração de insights são armazenados na tabela `AIPrompts`. Para adicionar um novo prompt:

1. Acesse o painel administrativo
2. Navegue até "Configurações > IA > Prompts"
3. Clique em "Adicionar Prompt"
4. Preencha os campos:
   - Título
   - Descrição
   - Prompt
   - Categoria (ex: "general", "medical", "financial", "budget")
   - Ativo (sim/não)
5. Clique em "Salvar"

## Testes

### Backend

Os testes do backend utilizam Jest e Supertest:

```bash
cd backend
npm test
```

Para executar testes específicos:

```bash
npm test -- --testPathPattern=auth
```

### Frontend

Os testes do frontend utilizam Jest e Testing Library:

```bash
cd frontend
npm test
```

Para executar testes específicos:

```bash
npm test -- --testPathPattern=Login
```

## Documentação

### API

A documentação da API é gerada automaticamente com Swagger:

1. Inicie o servidor backend
2. Acesse `http://localhost:3001/api-docs`

### Frontend

A documentação dos componentes do frontend é gerada com Storybook:

```bash
cd frontend
npm run storybook
```

## Implantação

### Ambiente de Produção

1. Construa o frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Configure as variáveis de ambiente de produção

3. Inicie o servidor backend:
   ```bash
   cd backend
   npm start
   ```

### Docker

O projeto inclui arquivos Docker para facilitar a implantação:

```bash
# Construir imagens
docker-compose build

# Iniciar serviços
docker-compose up -d
```

## Recursos Adicionais

- [Documentação do Node.js](https://nodejs.org/docs/latest-v16.x/api/)
- [Documentação do Express](https://expressjs.com/)
- [Documentação do Sequelize](https://sequelize.org/master/)
- [Documentação do React](https://reactjs.org/docs/getting-started.html)
- [Documentação do Tailwind CSS](https://tailwindcss.com/docs)
- [Documentação do PostgreSQL](https://www.postgresql.org/docs/)

## Suporte

Para obter suporte ou relatar problemas, entre em contato com a equipe de desenvolvimento:

- Email: dev@docai.com.br
- Slack: #docai-dev
