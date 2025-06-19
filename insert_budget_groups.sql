-- Script para inserir dados de exemplo para grupos de orçamentos
-- Este script adiciona dados de exemplo para demonstrar a funcionalidade de agrupamento de orçamentos

-- Atualizar orçamentos existentes para adicionar grupos
UPDATE "BudgetRecords"
SET 
  group_id = 'notebook-dell-inspiron-group',
  delivery_time = 10,
  warranty = '12 meses',
  warranty_months = 12,
  shipping_cost = 0,
  reclame_aqui_score = 7.8,
  product_rating = 4.5,
  depreciation = 25,
  risk_factors = ARRAY['Modelo com mais de 6 meses no mercado']
WHERE title LIKE 'Notebook Dell%';

-- Adicionar grupo para geladeiras
UPDATE "BudgetRecords"
SET 
  group_id = 'geladeira-electrolux-group',
  delivery_time = CASE 
    WHEN provider = 'Casas Bahia' THEN 10
    WHEN provider = 'Fast Shop' THEN 7
    ELSE delivery_time
  END,
  warranty = '12 meses',
  warranty_months = 12,
  shipping_cost = CASE 
    WHEN provider = 'Casas Bahia' THEN 150
    WHEN provider = 'Fast Shop' THEN 0
    ELSE shipping_cost
  END,
  reclame_aqui_score = CASE 
    WHEN provider = 'Casas Bahia' THEN 7.2
    WHEN provider = 'Fast Shop' THEN 8.5
    ELSE reclame_aqui_score
  END,
  product_rating = 4.5,
  depreciation = 18
WHERE title LIKE 'Geladeira Electrolux%';

-- Inserir novos orçamentos para smartphone
INSERT INTO "BudgetRecords" (
  id, document_id, user_id, title, provider, provider_cnpj, issue_date, valid_until, 
  total_amount, currency, category, status, items, payment_terms, delivery_terms, 
  notes, contact_info, group_id, delivery_time, warranty, warranty_months, 
  shipping_cost, reclame_aqui_score, product_rating, depreciation, risk_factors,
  created_at, updated_at
)
SELECT 
  gen_random_uuid(), -- id
  (SELECT id FROM "Documents" WHERE user_id = client_id LIMIT 1), -- document_id
  client_id, -- user_id
  'Smartphone Samsung Galaxy S23', -- title
  'Magazine Luiza', -- provider
  '47.960.950/0001-21', -- provider_cnpj
  '2025-06-01', -- issue_date
  '2025-07-01', -- valid_until
  3999.90, -- total_amount
  'BRL', -- currency
  'tecnologia', -- category
  'pendente', -- status
  '[{"description": "Smartphone Samsung Galaxy S23 128GB", "quantity": 1, "unitPrice": 3999.90}]'::jsonb, -- items
  'À vista ou em até 12x sem juros', -- payment_terms
  'Entrega em até 5 dias úteis', -- delivery_terms
  'Frete grátis para todo o Brasil', -- notes
  '{"nome": "SAC Magazine Luiza", "email": "sac@magazineluiza.com.br", "telefone": "(11) 3504-2500"}'::jsonb, -- contact_info
  'smartphone-samsung-s23-group', -- group_id
  5, -- delivery_time
  '12 meses', -- warranty
  12, -- warranty_months
  0, -- shipping_cost
  6.5, -- reclame_aqui_score
  4.7, -- product_rating
  30, -- depreciation
  ARRAY['Preço acima da média'], -- risk_factors
  NOW(), -- created_at
  NOW() -- updated_at
FROM (SELECT id as client_id FROM "Users" WHERE email = 'cliente@exemplo.com' LIMIT 1) as users;

-- Inserir segundo orçamento para smartphone
INSERT INTO "BudgetRecords" (
  id, document_id, user_id, title, provider, provider_cnpj, issue_date, valid_until, 
  total_amount, currency, category, status, items, payment_terms, delivery_terms, 
  notes, contact_info, group_id, delivery_time, warranty, warranty_months, 
  shipping_cost, reclame_aqui_score, product_rating, depreciation, risk_factors,
  created_at, updated_at
)
SELECT 
  gen_random_uuid(), -- id
  (SELECT id FROM "Documents" WHERE user_id = client_id LIMIT 1), -- document_id
  client_id, -- user_id
  'Smartphone Samsung Galaxy S23', -- title
  'Amazon Brasil', -- provider
  '15.436.940/0001-03', -- provider_cnpj
  '2025-06-03', -- issue_date
  '2025-07-03', -- valid_until
  3899.90, -- total_amount
  'BRL', -- currency
  'tecnologia', -- category
  'pendente', -- status
  '[{"description": "Smartphone Samsung Galaxy S23 128GB", "quantity": 1, "unitPrice": 3899.90}]'::jsonb, -- items
  'À vista ou em até 10x sem juros', -- payment_terms
  'Entrega em até 2 dias úteis', -- delivery_terms
  'Amazon Prime: entrega expressa', -- notes
  '{"nome": "Atendimento Amazon", "email": "atendimento@amazon.com.br", "telefone": "(11) 4004-1999"}'::jsonb, -- contact_info
  'smartphone-samsung-s23-group', -- group_id
  2, -- delivery_time
  '12 meses', -- warranty
  12, -- warranty_months
  0, -- shipping_cost
  8.2, -- reclame_aqui_score
  4.7, -- product_rating
  30, -- depreciation
  ARRAY[]::text[], -- risk_factors
  NOW(), -- created_at
  NOW() -- updated_at
FROM (SELECT id as client_id FROM "Users" WHERE email = 'cliente@exemplo.com' LIMIT 1) as users;

-- Inserir terceiro orçamento para smartphone
INSERT INTO "BudgetRecords" (
  id, document_id, user_id, title, provider, provider_cnpj, issue_date, valid_until, 
  total_amount, currency, category, status, items, payment_terms, delivery_terms, 
  notes, contact_info, group_id, delivery_time, warranty, warranty_months, 
  shipping_cost, reclame_aqui_score, product_rating, depreciation, risk_factors,
  created_at, updated_at
)
SELECT 
  gen_random_uuid(), -- id
  (SELECT id FROM "Documents" WHERE user_id = client_id LIMIT 1), -- document_id
  client_id, -- user_id
  'Smartphone Samsung Galaxy S23', -- title
  'Samsung Store', -- provider
  '00.280.273/0001-37', -- provider_cnpj
  '2025-06-05', -- issue_date
  '2025-07-05', -- valid_until
  4099.90, -- total_amount
  'BRL', -- currency
  'tecnologia', -- category
  'pendente', -- status
  '[{"description": "Smartphone Samsung Galaxy S23 128GB", "quantity": 1, "unitPrice": 4099.90}]'::jsonb, -- items
  'À vista ou em até 12x sem juros', -- payment_terms
  'Entrega em até 3 dias úteis', -- delivery_terms
  'Garantia estendida disponível', -- notes
  '{"nome": "Samsung Store", "email": "atendimento@samsung.com.br", "telefone": "(11) 4004-0000"}'::jsonb, -- contact_info
  'smartphone-samsung-s23-group', -- group_id
  3, -- delivery_time
  '12 meses', -- warranty
  12, -- warranty_months
  0, -- shipping_cost
  8.7, -- reclame_aqui_score
  4.7, -- product_rating
  30, -- depreciation
  ARRAY['Preço premium']::text[], -- risk_factors
  NOW(), -- created_at
  NOW() -- updated_at
FROM (SELECT id as client_id FROM "Users" WHERE email = 'cliente@exemplo.com' LIMIT 1) as users;
