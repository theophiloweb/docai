# Doc.AI - Sistema de Gerenciamento Inteligente de Documentos Pessoais

![Doc.AI Logo](https://via.placeholder.com/200x80?text=Doc.AI)

## Visão Geral

Doc.AI é uma plataforma inovadora para gerenciamento de documentos pessoais com recursos avançados de inteligência artificial. O sistema permite que usuários façam upload, organizem e obtenham insights valiosos de seus documentos pessoais em diversas categorias (saúde, finanças, orçamentos, etc.).

Diferente de serviços tradicionais de armazenamento em nuvem como Google Drive ou Microsoft OneDrive, o Doc.AI utiliza tecnologias de IA para extrair informações relevantes dos documentos, categorizá-los automaticamente e gerar insights personalizados que ajudam os usuários a tomar decisões mais informadas.

## Principais Recursos

### Gerenciamento Inteligente de Documentos
- Upload seguro de documentos em diversos formatos (PDF, imagens, etc.)
- Extração automática de texto via OCR (Tesseract.js)
- Categorização automática por IA
- Busca avançada por conteúdo e metadados
- Organização por categorias, tags e datas

### Dashboards Especializados
- **Dashboard Geral**: Visão geral de todos os documentos e insights
- **Dashboard Médico**: Visualização de histórico médico, consultas e exames
- **Dashboard Financeiro**: Análise de despesas, receitas e fluxo de caixa
- **Dashboard de Orçamentos**: Comparação e acompanhamento de orçamentos

### Insights com IA
- Geração dinâmica de insights usando Llama
- Análise de tendências em dados médicos e financeiros
- Comparação inteligente de orçamentos
- Recomendações personalizadas baseadas no conteúdo dos documentos
- Alertas sobre datas importantes e valores anormais

### Privacidade e Segurança
- Criptografia de dados em trânsito e em repouso
- Gerenciamento granular de consentimento
- Conformidade total com a LGPD
- Controle de acesso baseado em funções
- Autenticação segura com JWT

## Tecnologias Utilizadas

### Backend
- **Linguagem**: Node.js v18
- **Framework**: Express.js
- **Banco de Dados**: PostgreSQL 15
- **ORM**: Sequelize
- **Autenticação**: JWT (JSON Web Tokens)
- **Processamento de Documentos**: Tesseract.js para OCR
- **Logs**: Winston

### Frontend
- **Framework**: React.js 18
- **Roteamento**: React Router 6
- **Estilização**: Tailwind CSS
- **Formulários**: Formik com Yup
- **Estado**: Context API
- **Internacionalização**: i18next (pt-BR e en-US)
- **Gráficos**: Chart.js

### Inteligência Artificial
- **Motor de IA**: Integração com Llama
- **OCR**: Tesseract.js
- **Análise de Texto**: Processamento de linguagem natural
- **Categorização**: Algoritmos de classificação de texto

## Arquitetura do Sistema

### Estrutura de Diretórios
```
docai/
├── backend/
│   ├── logs/                  # Logs do sistema
│   ├── src/
│   │   ├── config/            # Configurações (banco de dados, etc.)
│   │   ├── controllers/       # Controladores da API
│   │   ├── database/          # Scripts de seed e migrações
│   │   ├── middleware/        # Middlewares (autenticação, etc.)
│   │   ├── models/            # Modelos do Sequelize
│   │   ├── routes/            # Rotas da API
│   │   ├── scripts/           # Scripts utilitários
│   │   ├── services/          # Serviços (OCR, etc.)
│   │   ├── utils/             # Funções utilitárias
│   │   └── server.js          # Ponto de entrada do servidor
│   ├── tests/                 # Testes automatizados
│   └── uploads/               # Documentos enviados pelos usuários
├── frontend/
│   ├── public/                # Arquivos públicos
│   └── src/
│       ├── assets/            # Imagens e recursos estáticos
│       ├── components/        # Componentes React reutilizáveis
│       ├── context/           # Contextos React
│       ├── hooks/             # Hooks personalizados
│       ├── layouts/           # Layouts de página
│       ├── locales/           # Arquivos de tradução
│       ├── pages/             # Páginas da aplicação
│       ├── services/          # Serviços (API, etc.)
│       └── utils/             # Funções utilitárias
└── docs/                      # Documentação do projeto
```

### Fluxo de Dados
1. O usuário faz upload de um documento
2. O backend processa o documento com OCR para extrair texto
3. A IA analisa o conteúdo e categoriza o documento
4. Os dados extraídos são armazenados no banco de dados
5. O frontend exibe o documento processado com insights gerados pela IA
6. O usuário pode interagir com os insights e gerenciar seus documentos

## Modelos de Dados

O sistema utiliza os seguintes modelos principais:

### Usuários e Autenticação
- **User**: Usuários do sistema (base para Admin e Client)
- **Admin**: Administradores do sistema
- **Client**: Clientes do sistema
- **Plan**: Planos de assinatura
- **Subscription**: Assinaturas dos usuários

### Documentos e Dados Extraídos
- **Document**: Documentos enviados pelos usuários
- **MedicalRecord**: Dados extraídos de documentos médicos
- **FinancialRecord**: Dados extraídos de documentos financeiros
- **BudgetRecord**: Dados extraídos de orçamentos

### Configurações e Sistema
- **AISettings**: Configurações dos provedores de IA
- **AIPrompt**: Prompts para geração de insights
- **SystemSettings**: Configurações gerais do sistema
- **Log**: Registros de atividades do sistema

## Dashboards Especializados

### Dashboard Médico
O dashboard médico oferece uma visão completa do histórico de saúde do usuário:
- Resumo de consultas, exames e medicamentos
- Gráficos de evolução de sinais vitais
- Gráficos de resultados de exames laboratoriais
- Análise de tendências e recomendações por IA
- Alertas sobre consultas de acompanhamento necessárias

### Dashboard Financeiro
O dashboard financeiro permite ao usuário acompanhar suas finanças:
- Resumo de receitas e despesas
- Gráficos de fluxo de caixa
- Análise de gastos por categoria
- Tendências de gastos ao longo do tempo
- Recomendações para otimização financeira

### Dashboard de Orçamentos
O dashboard de orçamentos ajuda o usuário a tomar decisões de compra:
- Comparação de orçamentos para o mesmo produto/serviço
- Análise de custo-benefício por IA
- Recomendações baseadas em preço, reputação e outros fatores
- Alertas sobre orçamentos prestes a expirar
- Visualização de tendências de preços

## Integração com IA

O Doc.AI utiliza a IA Llama para gerar insights personalizados para os usuários:

### Tipos de Insights
- **Insights Médicos**: Análise de tendências em exames e consultas
- **Insights Financeiros**: Análise de padrões de gastos e receitas
- **Insights de Orçamentos**: Comparação e recomendação de melhores opções
- **Insights Gerais**: Combinação de dados de diferentes categorias

### Fluxo de Integração
1. O frontend solicita insights ao backend
2. O backend prepara os dados e o prompt adequado
3. A solicitação é enviada para a API da Llama
4. A resposta da IA é processada e formatada
5. Os insights são retornados ao frontend para exibição

## Conformidade com a LGPD

O Doc.AI foi desenvolvido com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018) como base fundamental de sua arquitetura:

- **Privacy by Design**: Privacidade considerada desde a concepção do projeto
- **Consentimento Granular**: Controle detalhado sobre o uso dos dados
- **Direitos do Titular**: Acesso, correção, exclusão e portabilidade de dados
- **Segurança**: Criptografia, logs detalhados e controle de acesso
- **Transparência**: Explicações claras sobre o processamento automatizado

## Instalação e Configuração

### Requisitos
- Node.js v16 ou superior
- PostgreSQL 13 ou superior
- 4GB RAM mínimo recomendado
- 20GB de espaço em disco para instalação inicial

### Configuração do Backend
1. Instale as dependências:
   ```
   cd backend && npm install
   ```
2. Configure as variáveis de ambiente no arquivo `.env`:
   ```
   PORT=3001
   DB_NAME=docai
   DB_USER=admin
   DB_PASSWORD=1234
   DB_HOST=localhost
   DB_PORT=5432
   JWT_SECRET=seu_segredo_jwt
   JWT_EXPIRATION=24h
   ```
3. Inicie o servidor:
   ```
   npm run dev
   ```

### Configuração do Frontend
1. Instale as dependências:
   ```
   cd frontend && npm install
   ```
2. Configure a URL da API no arquivo `.env`:
   ```
   REACT_APP_API_URL=http://localhost:3001/api
   ```
3. Inicie o aplicativo:
   ```
   npm start
   ```

### Configuração do Banco de Dados
1. Certifique-se de que o PostgreSQL esteja instalado e em execução
2. Crie um banco de dados para o projeto:
   ```
   createdb docai
   ```
3. Execute as migrações:
   ```
   cd backend && npm run seed
   ```

## Contribuição

Para contribuir com o projeto, siga estas etapas:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Faça push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Licença

Todos os direitos reservados. Este software é proprietário e seu uso está sujeito aos termos do Contrato de Adesão e Política de Privacidade.

## Contato

Para mais informações, entre em contato através do email: contato@docai.com.br
