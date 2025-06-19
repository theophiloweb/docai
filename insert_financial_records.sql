-- Inserir documentos financeiros para o usuário cliente@exemplo.com (ID: b0f4e76d-0326-4318-a9a8-62779b061ac8)
INSERT INTO "Documents" (id, user_id, title, description, category, tags, file_path, file_type, file_size, content_text, ai_processed, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'b0f4e76d-0326-4318-a9a8-62779b061ac8', 'Extrato Bancário - Janeiro 2025', 'Extrato bancário do mês de janeiro', 'financeiro', ARRAY['extrato', 'banco'], '/uploads/financial/extrato_jan_2025.pdf', 'pdf', 245678, 'Conteúdo do extrato bancário de janeiro', true, '2025-02-05 10:00:00', '2025-02-05 10:00:00'),
  (gen_random_uuid(), 'b0f4e76d-0326-4318-a9a8-62779b061ac8', 'Extrato Bancário - Fevereiro 2025', 'Extrato bancário do mês de fevereiro', 'financeiro', ARRAY['extrato', 'banco'], '/uploads/financial/extrato_fev_2025.pdf', 'pdf', 256789, 'Conteúdo do extrato bancário de fevereiro', true, '2025-03-05 10:00:00', '2025-03-05 10:00:00'),
  (gen_random_uuid(), 'b0f4e76d-0326-4318-a9a8-62779b061ac8', 'Extrato Bancário - Março 2025', 'Extrato bancário do mês de março', 'financeiro', ARRAY['extrato', 'banco'], '/uploads/financial/extrato_mar_2025.pdf', 'pdf', 267890, 'Conteúdo do extrato bancário de março', true, '2025-04-05 10:00:00', '2025-04-05 10:00:00'),
  (gen_random_uuid(), 'b0f4e76d-0326-4318-a9a8-62779b061ac8', 'Extrato Bancário - Abril 2025', 'Extrato bancário do mês de abril', 'financeiro', ARRAY['extrato', 'banco'], '/uploads/financial/extrato_abr_2025.pdf', 'pdf', 278901, 'Conteúdo do extrato bancário de abril', true, '2025-05-05 10:00:00', '2025-05-05 10:00:00'),
  (gen_random_uuid(), 'b0f4e76d-0326-4318-a9a8-62779b061ac8', 'Extrato Bancário - Maio 2025', 'Extrato bancário do mês de maio', 'financeiro', ARRAY['extrato', 'banco'], '/uploads/financial/extrato_mai_2025.pdf', 'pdf', 289012, 'Conteúdo do extrato bancário de maio', true, '2025-06-05 10:00:00', '2025-06-05 10:00:00'),
  (gen_random_uuid(), 'b0f4e76d-0326-4318-a9a8-62779b061ac8', 'Fatura Cartão - Janeiro 2025', 'Fatura do cartão de crédito de janeiro', 'financeiro', ARRAY['fatura', 'cartão'], '/uploads/financial/fatura_jan_2025.pdf', 'pdf', 198765, 'Conteúdo da fatura de janeiro', true, '2025-02-10 10:00:00', '2025-02-10 10:00:00'),
  (gen_random_uuid(), 'b0f4e76d-0326-4318-a9a8-62779b061ac8', 'Fatura Cartão - Fevereiro 2025', 'Fatura do cartão de crédito de fevereiro', 'financeiro', ARRAY['fatura', 'cartão'], '/uploads/financial/fatura_fev_2025.pdf', 'pdf', 187654, 'Conteúdo da fatura de fevereiro', true, '2025-03-10 10:00:00', '2025-03-10 10:00:00'),
  (gen_random_uuid(), 'b0f4e76d-0326-4318-a9a8-62779b061ac8', 'Fatura Cartão - Março 2025', 'Fatura do cartão de crédito de março', 'financeiro', ARRAY['fatura', 'cartão'], '/uploads/financial/fatura_mar_2025.pdf', 'pdf', 176543, 'Conteúdo da fatura de março', true, '2025-04-10 10:00:00', '2025-04-10 10:00:00'),
  (gen_random_uuid(), 'b0f4e76d-0326-4318-a9a8-62779b061ac8', 'Fatura Cartão - Abril 2025', 'Fatura do cartão de crédito de abril', 'financeiro', ARRAY['fatura', 'cartão'], '/uploads/financial/fatura_abr_2025.pdf', 'pdf', 165432, 'Conteúdo da fatura de abril', true, '2025-05-10 10:00:00', '2025-05-10 10:00:00'),
  (gen_random_uuid(), 'b0f4e76d-0326-4318-a9a8-62779b061ac8', 'Fatura Cartão - Maio 2025', 'Fatura do cartão de crédito de maio', 'financeiro', ARRAY['fatura', 'cartão'], '/uploads/financial/fatura_mai_2025.pdf', 'pdf', 154321, 'Conteúdo da fatura de maio', true, '2025-06-10 10:00:00', '2025-06-10 10:00:00'),
  (gen_random_uuid(), 'b0f4e76d-0326-4318-a9a8-62779b061ac8', 'Recibo Aluguel - Janeiro 2025', 'Recibo de pagamento de aluguel de janeiro', 'financeiro', ARRAY['recibo', 'aluguel'], '/uploads/financial/recibo_aluguel_jan_2025.pdf', 'pdf', 87654, 'Conteúdo do recibo de aluguel de janeiro', true, '2025-01-05 10:00:00', '2025-01-05 10:00:00'),
  (gen_random_uuid(), 'b0f4e76d-0326-4318-a9a8-62779b061ac8', 'Recibo Aluguel - Fevereiro 2025', 'Recibo de pagamento de aluguel de fevereiro', 'financeiro', ARRAY['recibo', 'aluguel'], '/uploads/financial/recibo_aluguel_fev_2025.pdf', 'pdf', 87654, 'Conteúdo do recibo de aluguel de fevereiro', true, '2025-02-05 10:00:00', '2025-02-05 10:00:00'),
  (gen_random_uuid(), 'b0f4e76d-0326-4318-a9a8-62779b061ac8', 'Recibo Aluguel - Março 2025', 'Recibo de pagamento de aluguel de março', 'financeiro', ARRAY['recibo', 'aluguel'], '/uploads/financial/recibo_aluguel_mar_2025.pdf', 'pdf', 87654, 'Conteúdo do recibo de aluguel de março', true, '2025-03-05 10:00:00', '2025-03-05 10:00:00'),
  (gen_random_uuid(), 'b0f4e76d-0326-4318-a9a8-62779b061ac8', 'Recibo Aluguel - Abril 2025', 'Recibo de pagamento de aluguel de abril', 'financeiro', ARRAY['recibo', 'aluguel'], '/uploads/financial/recibo_aluguel_abr_2025.pdf', 'pdf', 87654, 'Conteúdo do recibo de aluguel de abril', true, '2025-04-05 10:00:00', '2025-04-05 10:00:00'),
  (gen_random_uuid(), 'b0f4e76d-0326-4318-a9a8-62779b061ac8', 'Recibo Aluguel - Maio 2025', 'Recibo de pagamento de aluguel de maio', 'financeiro', ARRAY['recibo', 'aluguel'], '/uploads/financial/recibo_aluguel_mai_2025.pdf', 'pdf', 87654, 'Conteúdo do recibo de aluguel de maio', true, '2025-05-05 10:00:00', '2025-05-05 10:00:00');

-- Obter os IDs dos documentos inseridos para usar nas transações financeiras
WITH doc_ids AS (
  SELECT id, title FROM "Documents" 
  WHERE user_id = 'b0f4e76d-0326-4318-a9a8-62779b061ac8' 
  AND category = 'financeiro'
  ORDER BY created_at DESC
  LIMIT 15
)
-- Inserir registros financeiros para o usuário cliente@exemplo.com
INSERT INTO "FinancialRecords" (
  id, document_id, user_id, record_type, transaction_date, amount, 
  currency, description, category, payment_method, establishment,
  is_expense, is_recurring, created_at, updated_at
)
SELECT
  gen_random_uuid(),
  (SELECT id FROM doc_ids WHERE title LIKE 'Extrato Bancário - Janeiro%'),
  'b0f4e76d-0326-4318-a9a8-62779b061ac8',
  'extrato_bancario',
  '2025-01-05',
  4500.00,
  'BRL',
  'Salário',
  'salario',
  'transferência',
  'Empresa ABC',
  false,
  true,
  '2025-01-05 10:00:00',
  '2025-01-05 10:00:00'
UNION ALL
SELECT
  gen_random_uuid(),
  (SELECT id FROM doc_ids WHERE title LIKE 'Recibo Aluguel - Janeiro%'),
  'b0f4e76d-0326-4318-a9a8-62779b061ac8',
  'recibo',
  '2025-01-05',
  1200.00,
  'BRL',
  'Aluguel',
  'moradia',
  'transferência',
  'Imobiliária XYZ',
  true,
  true,
  '2025-01-05 10:00:00',
  '2025-01-05 10:00:00'
UNION ALL
SELECT
  gen_random_uuid(),
  (SELECT id FROM doc_ids WHERE title LIKE 'Fatura Cartão - Janeiro%'),
  'b0f4e76d-0326-4318-a9a8-62779b061ac8',
  'fatura',
  '2025-01-15',
  450.75,
  'BRL',
  'Supermercado',
  'alimentacao',
  'cartão de crédito',
  'Supermercado Extra',
  true,
  false,
  '2025-01-15 10:00:00',
  '2025-01-15 10:00:00'
UNION ALL
SELECT
  gen_random_uuid(),
  (SELECT id FROM doc_ids WHERE title LIKE 'Fatura Cartão - Janeiro%'),
  'b0f4e76d-0326-4318-a9a8-62779b061ac8',
  'fatura',
  '2025-01-20',
  180.00,
  'BRL',
  'Conta de Energia',
  'utilidades',
  'cartão de crédito',
  'Companhia Elétrica',
  true,
  true,
  '2025-01-20 10:00:00',
  '2025-01-20 10:00:00'
UNION ALL
SELECT
  gen_random_uuid(),
  (SELECT id FROM doc_ids WHERE title LIKE 'Extrato Bancário - Fevereiro%'),
  'b0f4e76d-0326-4318-a9a8-62779b061ac8',
  'extrato_bancario',
  '2025-02-05',
  4500.00,
  'BRL',
  'Salário',
  'salario',
  'transferência',
  'Empresa ABC',
  false,
  true,
  '2025-02-05 10:00:00',
  '2025-02-05 10:00:00'
UNION ALL
SELECT
  gen_random_uuid(),
  (SELECT id FROM doc_ids WHERE title LIKE 'Recibo Aluguel - Fevereiro%'),
  'b0f4e76d-0326-4318-a9a8-62779b061ac8',
  'recibo',
  '2025-02-05',
  1200.00,
  'BRL',
  'Aluguel',
  'moradia',
  'transferência',
  'Imobiliária XYZ',
  true,
  true,
  '2025-02-05 10:00:00',
  '2025-02-05 10:00:00'
UNION ALL
SELECT
  gen_random_uuid(),
  (SELECT id FROM doc_ids WHERE title LIKE 'Fatura Cartão - Fevereiro%'),
  'b0f4e76d-0326-4318-a9a8-62779b061ac8',
  'fatura',
  '2025-02-15',
  520.30,
  'BRL',
  'Supermercado',
  'alimentacao',
  'cartão de crédito',
  'Supermercado Extra',
  true,
  false,
  '2025-02-15 10:00:00',
  '2025-02-15 10:00:00'
UNION ALL
SELECT
  gen_random_uuid(),
  (SELECT id FROM doc_ids WHERE title LIKE 'Fatura Cartão - Fevereiro%'),
  'b0f4e76d-0326-4318-a9a8-62779b061ac8',
  'fatura',
  '2025-02-20',
  185.50,
  'BRL',
  'Conta de Energia',
  'utilidades',
  'cartão de crédito',
  'Companhia Elétrica',
  true,
  true,
  '2025-02-20 10:00:00',
  '2025-02-20 10:00:00'
UNION ALL
SELECT
  gen_random_uuid(),
  (SELECT id FROM doc_ids WHERE title LIKE 'Extrato Bancário - Março%'),
  'b0f4e76d-0326-4318-a9a8-62779b061ac8',
  'extrato_bancario',
  '2025-03-05',
  4500.00,
  'BRL',
  'Salário',
  'salario',
  'transferência',
  'Empresa ABC',
  false,
  true,
  '2025-03-05 10:00:00',
  '2025-03-05 10:00:00'
UNION ALL
SELECT
  gen_random_uuid(),
  (SELECT id FROM doc_ids WHERE title LIKE 'Recibo Aluguel - Março%'),
  'b0f4e76d-0326-4318-a9a8-62779b061ac8',
  'recibo',
  '2025-03-05',
  1200.00,
  'BRL',
  'Aluguel',
  'moradia',
  'transferência',
  'Imobiliária XYZ',
  true,
  true,
  '2025-03-05 10:00:00',
  '2025-03-05 10:00:00'
UNION ALL
SELECT
  gen_random_uuid(),
  (SELECT id FROM doc_ids WHERE title LIKE 'Fatura Cartão - Março%'),
  'b0f4e76d-0326-4318-a9a8-62779b061ac8',
  'fatura',
  '2025-03-15',
  480.25,
  'BRL',
  'Supermercado',
  'alimentacao',
  'cartão de crédito',
  'Supermercado Extra',
  true,
  false,
  '2025-03-15 10:00:00',
  '2025-03-15 10:00:00'
UNION ALL
SELECT
  gen_random_uuid(),
  (SELECT id FROM doc_ids WHERE title LIKE 'Fatura Cartão - Março%'),
  'b0f4e76d-0326-4318-a9a8-62779b061ac8',
  'fatura',
  '2025-03-20',
  190.75,
  'BRL',
  'Conta de Energia',
  'utilidades',
  'cartão de crédito',
  'Companhia Elétrica',
  true,
  true,
  '2025-03-20 10:00:00',
  '2025-03-20 10:00:00'
UNION ALL
SELECT
  gen_random_uuid(),
  (SELECT id FROM doc_ids WHERE title LIKE 'Extrato Bancário - Abril%'),
  'b0f4e76d-0326-4318-a9a8-62779b061ac8',
  'extrato_bancario',
  '2025-04-05',
  4500.00,
  'BRL',
  'Salário',
  'salario',
  'transferência',
  'Empresa ABC',
  false,
  true,
  '2025-04-05 10:00:00',
  '2025-04-05 10:00:00'
UNION ALL
SELECT
  gen_random_uuid(),
  (SELECT id FROM doc_ids WHERE title LIKE 'Recibo Aluguel - Abril%'),
  'b0f4e76d-0326-4318-a9a8-62779b061ac8',
  'recibo',
  '2025-04-05',
  1200.00,
  'BRL',
  'Aluguel',
  'moradia',
  'transferência',
  'Imobiliária XYZ',
  true,
  true,
  '2025-04-05 10:00:00',
  '2025-04-05 10:00:00'
UNION ALL
SELECT
  gen_random_uuid(),
  (SELECT id FROM doc_ids WHERE title LIKE 'Fatura Cartão - Abril%'),
  'b0f4e76d-0326-4318-a9a8-62779b061ac8',
  'fatura',
  '2025-04-15',
  510.45,
  'BRL',
  'Supermercado',
  'alimentacao',
  'cartão de crédito',
  'Supermercado Extra',
  true,
  false,
  '2025-04-15 10:00:00',
  '2025-04-15 10:00:00'
UNION ALL
SELECT
  gen_random_uuid(),
  (SELECT id FROM doc_ids WHERE title LIKE 'Fatura Cartão - Abril%'),
  'b0f4e76d-0326-4318-a9a8-62779b061ac8',
  'fatura',
  '2025-04-20',
  195.30,
  'BRL',
  'Conta de Energia',
  'utilidades',
  'cartão de crédito',
  'Companhia Elétrica',
  true,
  true,
  '2025-04-20 10:00:00',
  '2025-04-20 10:00:00'
UNION ALL
SELECT
  gen_random_uuid(),
  (SELECT id FROM doc_ids WHERE title LIKE 'Extrato Bancário - Maio%'),
  'b0f4e76d-0326-4318-a9a8-62779b061ac8',
  'extrato_bancario',
  '2025-05-05',
  4500.00,
  'BRL',
  'Salário',
  'salario',
  'transferência',
  'Empresa ABC',
  false,
  true,
  '2025-05-05 10:00:00',
  '2025-05-05 10:00:00'
UNION ALL
SELECT
  gen_random_uuid(),
  (SELECT id FROM doc_ids WHERE title LIKE 'Recibo Aluguel - Maio%'),
  'b0f4e76d-0326-4318-a9a8-62779b061ac8',
  'recibo',
  '2025-05-05',
  1200.00,
  'BRL',
  'Aluguel',
  'moradia',
  'transferência',
  'Imobiliária XYZ',
  true,
  true,
  '2025-05-05 10:00:00',
  '2025-05-05 10:00:00'
UNION ALL
SELECT
  gen_random_uuid(),
  (SELECT id FROM doc_ids WHERE title LIKE 'Fatura Cartão - Maio%'),
  'b0f4e76d-0326-4318-a9a8-62779b061ac8',
  'fatura',
  '2025-05-15',
  490.85,
  'BRL',
  'Supermercado',
  'alimentacao',
  'cartão de crédito',
  'Supermercado Extra',
  true,
  false,
  '2025-05-15 10:00:00',
  '2025-05-15 10:00:00'
UNION ALL
SELECT
  gen_random_uuid(),
  (SELECT id FROM doc_ids WHERE title LIKE 'Fatura Cartão - Maio%'),
  'b0f4e76d-0326-4318-a9a8-62779b061ac8',
  'fatura',
  '2025-05-20',
  187.65,
  'BRL',
  'Conta de Energia',
  'utilidades',
  'cartão de crédito',
  'Companhia Elétrica',
  true,
  true,
  '2025-05-20 10:00:00',
  '2025-05-20 10:00:00';
