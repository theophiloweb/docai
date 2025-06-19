-- Obter os IDs dos documentos inseridos para usar nas transações financeiras
WITH doc_ids AS (
  SELECT id, title FROM "Documents" 
  WHERE user_id = 'b0f4e76d-0326-4318-a9a8-62779b061ac8'::uuid 
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
  'b0f4e76d-0326-4318-a9a8-62779b061ac8'::uuid,
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
  'b0f4e76d-0326-4318-a9a8-62779b061ac8'::uuid,
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
  'b0f4e76d-0326-4318-a9a8-62779b061ac8'::uuid,
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
  'b0f4e76d-0326-4318-a9a8-62779b061ac8'::uuid,
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
  'b0f4e76d-0326-4318-a9a8-62779b061ac8'::uuid,
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
  'b0f4e76d-0326-4318-a9a8-62779b061ac8'::uuid,
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
  'b0f4e76d-0326-4318-a9a8-62779b061ac8'::uuid,
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
  'b0f4e76d-0326-4318-a9a8-62779b061ac8'::uuid,
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
  'b0f4e76d-0326-4318-a9a8-62779b061ac8'::uuid,
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
  'b0f4e76d-0326-4318-a9a8-62779b061ac8'::uuid,
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
  'b0f4e76d-0326-4318-a9a8-62779b061ac8'::uuid,
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
  'b0f4e76d-0326-4318-a9a8-62779b061ac8'::uuid,
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
  'b0f4e76d-0326-4318-a9a8-62779b061ac8'::uuid,
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
  'b0f4e76d-0326-4318-a9a8-62779b061ac8'::uuid,
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
  'b0f4e76d-0326-4318-a9a8-62779b061ac8'::uuid,
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
  'b0f4e76d-0326-4318-a9a8-62779b061ac8'::uuid,
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
  'b0f4e76d-0326-4318-a9a8-62779b061ac8'::uuid,
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
  'b0f4e76d-0326-4318-a9a8-62779b061ac8'::uuid,
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
  'b0f4e76d-0326-4318-a9a8-62779b061ac8'::uuid,
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
  'b0f4e76d-0326-4318-a9a8-62779b061ac8'::uuid,
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
