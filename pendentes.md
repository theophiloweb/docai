# Tarefas Pendentes - Doc.AI

## Prompts de IA e Processamento de Documentos

### Alterações Implementadas (18/06/2025)

1. **Dinamização dos Prompts de IA**
   - Modificamos o serviço `insights.service.js` para buscar prompts do banco de dados em vez de usar prompts estáticos
   - Implementamos um sistema de fallback para usar prompts padrão caso não encontre no banco
   - Criamos um seeder `aiPromptSeeder.js` para adicionar prompts padrão ao banco de dados
   - Atualizamos o modelo AIPrompt para garantir que tenha os campos necessários

2. **Correção na Substituição de Variáveis nos Prompts**
   - Implementamos verificação para garantir que o texto extraído pela OCR seja incluído no prompt
   - Adicionamos lógica para lidar com prompts que não contêm a variável `${truncatedText}`
   - Corrigimos os prompts no seeder para usar a variável `${truncatedText}` corretamente

### Problemas Identificados

1. **Resumos Incompletos ou Genéricos**
   - Problema: Os resumos gerados pela IA são muito superficiais ou genéricos
   - Exemplo: Para um documento médico detalhado, o resumo foi apenas "Governo do Estado do Ceará Departamento Estadual de Trânsito"
   - Causa provável: O prompt não está sendo processado corretamente ou o texto extraído não está sendo incluído no prompt

2. **Informações de Documento não Exibidas**
   - Problema: Na visualização do documento, os campos "Tipo de arquivo" e "Tamanho" aparecem como "N/A"
   - Causa: Os campos não estão sendo salvos corretamente no banco de dados

3. **Datas de Documento**
   - Problema: Falta diferenciação entre data de envio e data de criação do documento
   - Solução implementada: Adicionamos o campo `documentDate` ao modelo Document

### Próximos Passos

1. **Testar Geração de Insights**
   - Verificar se os prompts estão sendo buscados corretamente do banco de dados
   - Confirmar que o texto extraído está sendo incluído nos prompts
   - Testar a geração de insights com diferentes tipos de documentos

2. **Melhorar Qualidade dos Resumos**
   - Revisar e otimizar os prompts para gerar resumos mais detalhados e relevantes
   - Considerar aumentar o limite de tokens para permitir respostas mais completas

3. **Verificar Exibição de Documentos**
   - Confirmar que os campos "Tipo de arquivo" e "Tamanho" estão sendo exibidos corretamente
   - Verificar se a diferenciação entre data de envio e data de criação está funcionando

4. **Implementar Migração de Dados**
   - Criar script para migrar prompts existentes para o novo formato
   - Garantir compatibilidade com prompts antigos

### Localização dos Prompts

Os prompts para o pós-processamento de cada categoria estão localizados em:
- **Arquivo**: `/home/devuser/docai/backend/src/services/insights.service.js`
- **Prompt médico**: linhas 150-200
- **Prompt financeiro**: linhas 200-230
- **Prompt de orçamento**: linhas 230-260

Agora os prompts também podem ser gerenciados através do painel de administração na seção "Configurações de IA" > "Prompts de IA".
