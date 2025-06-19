# Documentação Técnica: Sistema de OCR e Análise de Documentos

## 1. Visão Geral

O sistema de OCR (Reconhecimento Óptico de Caracteres) e análise de documentos do Doc.AI foi implementado para extrair texto de documentos em diversos formatos (PDF, imagens) e analisar seu conteúdo usando inteligência artificial. Este documento detalha as implementações técnicas, dependências e estrutura de dados utilizadas.

## 2. Dependências Instaladas

### 2.1 Dependências do Sistema

As seguintes ferramentas foram instaladas no sistema operacional:

```bash
# Tesseract OCR e idioma português
sudo apt-get install -y tesseract-ocr tesseract-ocr-por

# Poppler-utils (para manipulação de PDFs)
sudo apt-get install -y poppler-utils

# ImageMagick (para pré-processamento de imagens)
sudo apt-get install -y imagemagick
```

### 2.2 Dependências da Aplicação Node.js

As seguintes bibliotecas foram instaladas no backend:

```bash
# Bibliotecas para OCR e processamento de documentos
npm install tesseract.js pdf-parse pdf.js-extract axios

# Biblioteca para chamadas à API de IA
npm install openai axios
```

## 3. Implementação do Serviço de OCR

### 3.1 Serviço de OCR Baseado em CLI

Criamos um serviço personalizado (`cli.ocr.service.js`) que utiliza ferramentas de linha de comando para extrair texto de documentos:

```javascript
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const axios = require('axios');
const logger = require('../utils/logger');
```

### 3.2 Extração de Texto de PDFs

Implementamos uma abordagem em cascata para extrair texto de PDFs:

1. Primeiro, tentamos com `pdftotext` (mais rápido):
   ```javascript
   const { stdout } = await execPromise(`pdftotext -layout -nopgbrk "${filePath}" -`);
   ```

2. Se falhar, convertemos o PDF para imagens e usamos OCR:
   ```javascript
   await execPromise(`pdftoppm -png -r 300 "${filePath}" "${imageBasePath}"`);
   ```

3. Para documentos com múltiplas páginas, processamos todas as páginas:
   ```javascript
   const { stdout: pdfInfoOutput } = await execPromise(`pdfinfo "${filePath}"`);
   const pagesMatch = pdfInfoOutput.match(/Pages:\s+(\d+)/);
   const numPages = pagesMatch ? parseInt(pagesMatch[1]) : 0;
   ```

### 3.3 Extração de Texto de Imagens

Para imagens, implementamos um processo de pré-processamento para melhorar a qualidade do OCR:

```javascript
// Melhorar a imagem com ImageMagick
await execPromise(`convert "${filePath}" -normalize -sharpen 0x1 -contrast -contrast -modulate 100,150 -deskew 40% "${enhancedImagePath}"`);

// Usar Tesseract com configurações avançadas
const { stdout } = await execPromise(`tesseract "${imageToProcess}" stdout -l por --oem 1 --psm 3 --dpi 300`);
```

### 3.4 Configurações do Tesseract

Utilizamos diferentes configurações do Tesseract para otimizar o reconhecimento:

- `--oem 1`: Usar apenas o motor LSTM (mais preciso para textos complexos)
- `--psm 3`: Segmentação automática de página com OCR
- `-l por`: Usar o modelo de português
- `--dpi 300`: Definir DPI para 300 (melhor para documentos escaneados)

## 4. Integração com IA para Análise de Documentos

### 4.1 Configuração da API de IA

Utilizamos a API OpenRouter para acessar o modelo Llama 4:

```javascript
// Configurações da API
const apiKey = process.env.AI_API_KEY;
const apiUrl = process.env.AI_API_URL || 'https://openrouter.ai/api/v1';
const model = process.env.AI_MODEL || 'meta-llama/llama-4-maverick:free';
```

### 4.2 Análise de Documentos por Tipo

Implementamos prompts específicos para cada tipo de documento:

```javascript
// Para documentos médicos
const prompt = `
  Você é um assistente especializado em análise de documentos médicos.
  
  Analise o seguinte documento médico e extraia as informações estruturadas:
  
  1. Nome do médico
  2. CRM do médico
  3. Especialidade do médico
  4. Data do documento (no formato YYYY-MM-DD)
  5. Nome do paciente
  6. Diagnóstico principal
  7. Prescrições ou recomendações
  8. Exames solicitados ou resultados de exames
  
  Retorne apenas um objeto JSON com essas informações, sem explicações adicionais.
  Se alguma informação não estiver disponível, use null para o valor.
  
  Documento:
  ${truncatedText}
`;
```

### 4.3 Otimizações para Performance

Para melhorar a performance da análise:

1. Limitamos o texto enviado para análise a 3000 caracteres
2. Reduzimos o número de tokens máximos na resposta da IA
3. Adicionamos um timeout específico para a chamada à API da IA

```javascript
const maxTextLength = 3000;
const truncatedText = text.length > maxTextLength 
  ? text.substring(0, maxTextLength) + '...' 
  : text;

// Configurações da chamada à API
{
  temperature: 0.2,
  max_tokens: 800,
  timeout: 30000
}
```

## 5. Estrutura de Dados e Armazenamento

### 5.1 Tabelas do Banco de Dados

Os dados extraídos e analisados são armazenados em duas categorias de tabelas:

#### 5.1.1 Tabela Document (Geral)

Armazena informações gerais sobre todos os documentos:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Identificador único do documento |
| userId | UUID | ID do usuário que enviou o documento |
| title | String | Título do documento |
| description | String | Descrição do documento |
| category | String | Categoria do documento (medical, financial, budget) |
| contentText | Text | Texto extraído completo do documento |
| aiProcessed | Boolean | Indica se o documento foi processado por IA |
| createdAt | DateTime | Data de criação do registro |
| updatedAt | DateTime | Data de atualização do registro |

#### 5.1.2 Tabela MedicalRecord (Documentos Médicos)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Identificador único do registro médico |
| documentId | UUID | ID do documento relacionado |
| userId | UUID | ID do usuário |
| doctorName | String | Nome do médico extraído pela IA |
| doctorCRM | String | CRM do médico extraído pela IA |
| doctorSpecialty | String | Especialidade do médico extraída pela IA |
| recordType | String | Tipo de registro médico |
| recordDate | Date | Data do documento médico |
| patientName | String | Nome do paciente extraído pela IA |
| diagnosis | Text | Diagnóstico extraído pela IA |
| prescriptions | Text | Prescrições extraídas pela IA |
| exams | Text | Exames solicitados/resultados extraídos pela IA |
| rawText | Text | Texto bruto extraído do documento |
| insights | JSON | Insights gerados pela IA |

#### 5.1.3 Tabela FinancialRecord (Documentos Financeiros)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Identificador único do registro financeiro |
| documentId | UUID | ID do documento relacionado |
| userId | UUID | ID do usuário |
| documentType | String | Tipo de documento financeiro extraído pela IA |
| documentDate | Date | Data do documento financeiro |
| totalAmount | Decimal | Valor total extraído pela IA |
| issuer | String | Emissor/fornecedor extraído pela IA |
| category | String | Categoria extraída pela IA |
| dueDate | Date | Data de vencimento extraída pela IA |
| status | String | Status do documento financeiro |
| items | JSON | Itens ou serviços listados extraídos pela IA |
| rawText | Text | Texto bruto extraído do documento |

#### 5.1.4 Tabela BudgetRecord (Orçamentos)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Identificador único do registro de orçamento |
| documentId | UUID | ID do documento relacionado |
| userId | UUID | ID do usuário |
| title | String | Título do orçamento extraído pela IA |
| provider | String | Fornecedor extraído pela IA |
| issueDate | Date | Data de emissão do orçamento |
| validUntil | Date | Data de validade do orçamento |
| totalAmount | Decimal | Valor total extraído pela IA |
| category | String | Categoria extraída pela IA |
| items | JSON | Itens ou serviços listados extraídos pela IA |
| paymentTerms | String | Condições de pagamento extraídas pela IA |
| deliveryTime | String | Prazo de entrega extraído pela IA |
| status | String | Status do orçamento |
| rawText | Text | Texto bruto extraído do documento |

### 5.2 Fluxo de Salvamento de Dados

O processo de salvamento de dados segue o seguinte fluxo:

1. O usuário faz upload de um documento
2. O sistema extrai o texto usando OCR
3. O texto extraído é analisado pela IA
4. O usuário confirma os dados extraídos
5. Os dados são salvos nas tabelas apropriadas:
   - Informações gerais na tabela `Document`
   - Dados específicos na tabela correspondente ao tipo de documento

```javascript
// Exemplo de salvamento de documento médico
const document = await Document.create({
  userId,
  title: analysisResult.title || 'Documento Médico',
  description: analysisResult.description || `Consulta com Dr. ${analysisResult.doctorName || 'Não identificado'}`,
  category: 'medical',
  contentText: extractedText,
  aiProcessed: true
});

const medicalRecord = await MedicalRecord.create({
  documentId: document.id,
  userId,
  doctorName: analysisResult.doctorName || null,
  doctorCRM: analysisResult.doctorCRM || null,
  doctorSpecialty: analysisResult.doctorSpecialty || analysisResult.specialty || null,
  recordType: 'consulta',
  recordDate: analysisResult.documentDate || new Date(),
  patientName: analysisResult.patientName || null,
  diagnosis: analysisResult.diagnosis || null,
  prescriptions: analysisResult.prescriptions || null,
  exams: analysisResult.exams || null,
  rawText: extractedText,
  insights: JSON.stringify(insights)
});
```

## 6. Tratamento de Documentos com Múltiplas Páginas

Para documentos com múltiplas páginas, implementamos um sistema que:

1. Extrai o número total de páginas do PDF
2. Converte cada página para uma imagem
3. Processa cada imagem com OCR
4. Concatena os resultados com marcadores de página
5. Armazena o texto completo no banco de dados

Este processo garante que documentos com múltiplas páginas sejam tratados como uma unidade coesa, mantendo a integridade do documento como um todo.

## 7. Configurações de Ambiente

As configurações do sistema são gerenciadas através de variáveis de ambiente:

```
# Configurações de API de IA
AI_API_KEY=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
AI_API_URL=https://openrouter.ai/api/v1
AI_PROVIDER=openrouter
AI_MODEL=meta-llama/llama-4-maverick:free
```

## 8. Considerações de Performance e Escalabilidade

Para garantir a performance e escalabilidade do sistema:

1. Implementamos timeouts adequados para evitar bloqueios
2. Utilizamos processamento assíncrono para operações de OCR
3. Limitamos o tamanho do texto enviado para análise pela IA
4. Adicionamos tratamento robusto de erros em todas as etapas
5. Implementamos feedback visual para o usuário durante o processamento

Estas otimizações permitem que o sistema processe documentos de forma eficiente, mesmo aqueles com múltiplas páginas ou baixa qualidade.
