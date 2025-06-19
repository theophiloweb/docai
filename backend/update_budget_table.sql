-- Script para atualizar a tabela BudgetRecords com novas colunas
-- Execute este script diretamente no PostgreSQL se o script automático falhar

-- Adicionar novas colunas
ALTER TABLE "BudgetRecords" 
ADD COLUMN IF NOT EXISTS "group_id" VARCHAR(255),
ADD COLUMN IF NOT EXISTS "product_details" JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS "delivery_time" INTEGER,
ADD COLUMN IF NOT EXISTS "warranty" VARCHAR(255),
ADD COLUMN IF NOT EXISTS "warranty_months" INTEGER,
ADD COLUMN IF NOT EXISTS "shipping_cost" DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS "reclame_aqui_score" FLOAT,
ADD COLUMN IF NOT EXISTS "product_rating" FLOAT,
ADD COLUMN IF NOT EXISTS "depreciation" FLOAT,
ADD COLUMN IF NOT EXISTS "risk_factors" TEXT[];

-- Atualizar o tipo do status para incluir 'fechado' em vez de 'convertido'
ALTER TABLE "BudgetRecords" 
DROP CONSTRAINT IF EXISTS "BudgetRecords_status_check";

ALTER TABLE "BudgetRecords" 
ADD CONSTRAINT "BudgetRecords_status_check" 
CHECK (status IN ('pendente', 'aprovado', 'rejeitado', 'expirado', 'fechado'));

-- Atualizar registros existentes que tenham status 'convertido' para 'fechado'
UPDATE "BudgetRecords" 
SET status = 'fechado' 
WHERE status = 'convertido';

-- Adicionar índice para a nova coluna group_id
CREATE INDEX IF NOT EXISTS "idx_budget_records_group_id" ON "BudgetRecords" ("group_id");

-- Inserir dados de exemplo para demonstração de grupos de orçamentos
INSERT INTO "BudgetRecords" (
  id, document_id, user_id, title, provider, provider_c_n_p_j, 
  issue_date, valid_until, total_amount, currency, category, status, 
  items, payment_terms, delivery_terms, notes, contact_info, 
  group_id, delivery_time, warranty, warranty_months, shipping_cost, 
  reclame_aqui_score, product_rating, depreciation, risk_factors,
  created_at, updated_at
) VALUES 
-- Grupo 1: Notebook Dell Inspiron
(
  gen_random_uuid(), 'b0f4e76d-0326-4318-a9a8-62779b061ac8', 'b0f4e76d-0326-4318-a9a8-62779b061ac8', 
  'Notebook Dell Inspiron 15', 'Dell Computadores', '72.381.189/0001-10',
  '2025-05-15', '2025-06-15', 4599.90, 'BRL', 'tecnologia', 'pendente',
  '[{"description": "Notebook Dell Inspiron 15 3000", "quantity": 1, "unitPrice": 4599.90}]',
  'À vista ou em até 12x sem juros', 'Entrega em até 10 dias úteis', 'Inclui garantia de 1 ano',
  '{"nome": "Atendimento Dell", "email": "vendas@dell.com", "telefone": "(11) 4004-0000"}',
  'notebook-dell-inspiron-group', 10, '12 meses', 12, 0, 7.8, 4.5, 25,
  '["Modelo com mais de 6 meses no mercado"]',
  NOW(), NOW()
),
(
  gen_random_uuid(), 'b0f4e76d-0326-4318-a9a8-62779b061ac8', 'b0f4e76d-0326-4318-a9a8-62779b061ac8', 
  'Notebook Dell Inspiron 15', 'Magazine Luiza', '47.960.950/0001-21',
  '2025-05-20', '2025-06-20', 4799.90, 'BRL', 'tecnologia', 'pendente',
  '[{"description": "Notebook Dell Inspiron 15 3000", "quantity": 1, "unitPrice": 4799.90}]',
  'À vista ou em até 10x sem juros', 'Entrega em até 15 dias úteis', 'Frete grátis para todo o Brasil',
  '{"nome": "SAC Magazine Luiza", "email": "sac@magazineluiza.com.br", "telefone": "(11) 3504-2500"}',
  'notebook-dell-inspiron-group', 15, '12 meses', 12, 0, 6.5, 4.5, 25,
  '["Preço acima da média", "Tempo de entrega longo"]',
  NOW(), NOW()
),
(
  gen_random_uuid(), 'b0f4e76d-0326-4318-a9a8-62779b061ac8', 'b0f4e76d-0326-4318-a9a8-62779b061ac8', 
  'Notebook Dell Inspiron 15', 'Amazon Brasil', '15.436.940/0001-03',
  '2025-05-22', '2025-06-22', 4499.90, 'BRL', 'tecnologia', 'pendente',
  '[{"description": "Notebook Dell Inspiron 15 3000", "quantity": 1, "unitPrice": 4499.90}]',
  'À vista ou em até 12x sem juros', 'Entrega em até 3 dias úteis', 'Amazon Prime: entrega expressa',
  '{"nome": "Atendimento Amazon", "email": "atendimento@amazon.com.br", "telefone": "(11) 4004-1999"}',
  'notebook-dell-inspiron-group', 3, '12 meses', 12, 0, 8.2, 4.5, 25,
  '[]',
  NOW(), NOW()
),

-- Grupo 2: Geladeira Electrolux
(
  gen_random_uuid(), 'b0f4e76d-0326-4318-a9a8-62779b061ac8', 'b0f4e76d-0326-4318-a9a8-62779b061ac8', 
  'Geladeira Electrolux Frost Free', 'Casas Bahia', '33.041.260/0652-90',
  '2025-06-02', '2025-07-02', 3299.90, 'BRL', 'eletrodomestico', 'pendente',
  '[{"description": "Geladeira Electrolux Frost Free 382L", "quantity": 1, "unitPrice": 3299.90}]',
  'À vista ou em até 12x sem juros', 'Entrega em até 10 dias úteis', 'Instalação não inclusa',
  '{"nome": "SAC Casas Bahia", "email": "sac@casasbahia.com.br", "telefone": "(11) 3003-8889"}',
  'geladeira-electrolux-group', 10, '12 meses', 12, 150, 7.2, 4.5, 18,
  '[]',
  NOW(), NOW()
),
(
  gen_random_uuid(), 'b0f4e76d-0326-4318-a9a8-62779b061ac8', 'b0f4e76d-0326-4318-a9a8-62779b061ac8', 
  'Geladeira Electrolux Frost Free', 'Fast Shop', '43.708.379/0001-00',
  '2025-06-03', '2025-07-03', 3399.90, 'BRL', 'eletrodomestico', 'pendente',
  '[{"description": "Geladeira Electrolux Frost Free 382L", "quantity": 1, "unitPrice": 3399.90}]',
  'À vista com 5% de desconto ou em até 10x sem juros', 'Entrega em até 7 dias úteis', 'Instalação gratuita',
  '{"nome": "SAC Fast Shop", "email": "sac@fastshop.com.br", "telefone": "(11) 3003-3728"}',
  'geladeira-electrolux-group', 7, '12 meses', 12, 0, 8.5, 4.5, 18,
  '[]',
  NOW(), NOW()
),
(
  gen_random_uuid(), 'b0f4e76d-0326-4318-a9a8-62779b061ac8', 'b0f4e76d-0326-4318-a9a8-62779b061ac8', 
  'Geladeira Electrolux Frost Free', 'Ponto Frio', '33.041.260/0652-90',
  '2025-06-05', '2025-07-05', 3349.90, 'BRL', 'eletrodomestico', 'pendente',
  '[{"description": "Geladeira Electrolux Frost Free 382L", "quantity": 1, "unitPrice": 3349.90}]',
  'À vista ou em até 10x sem juros', 'Entrega em até 12 dias úteis', 'Garantia estendida disponível',
  '{"nome": "SAC Ponto Frio", "email": "sac@pontofrio.com.br", "telefone": "(11) 3003-8889"}',
  'geladeira-electrolux-group', 12, '12 meses', 12, 120, 7.0, 4.5, 18,
  '["Tempo de entrega longo"]',
  NOW(), NOW()
),

-- Grupo 3: Smartphone Samsung Galaxy
(
  gen_random_uuid(), 'b0f4e76d-0326-4318-a9a8-62779b061ac8', 'b0f4e76d-0326-4318-a9a8-62779b061ac8', 
  'Smartphone Samsung Galaxy S23', 'Samsung Brasil', '00.280.273/0001-37',
  '2025-06-10', '2025-07-10', 5499.90, 'BRL', 'tecnologia', 'pendente',
  '[{"description": "Smartphone Samsung Galaxy S23 128GB", "quantity": 1, "unitPrice": 5499.90}]',
  'À vista ou em até 12x sem juros', 'Entrega em até 5 dias úteis', 'Brinde: Carregador sem fio',
  '{"nome": "SAC Samsung", "email": "atendimento@samsung.com.br", "telefone": "(11) 4004-0000"}',
  'smartphone-samsung-group', 5, '12 meses', 12, 0, 8.7, 4.8, 35,
  '[]',
  NOW(), NOW()
),
(
  gen_random_uuid(), 'b0f4e76d-0326-4318-a9a8-62779b061ac8', 'b0f4e76d-0326-4318-a9a8-62779b061ac8', 
  'Smartphone Samsung Galaxy S23', 'Magazine Luiza', '47.960.950/0001-21',
  '2025-06-12', '2025-07-12', 5299.90, 'BRL', 'tecnologia', 'pendente',
  '[{"description": "Smartphone Samsung Galaxy S23 128GB", "quantity": 1, "unitPrice": 5299.90}]',
  'À vista ou em até 10x sem juros', 'Entrega em até 8 dias úteis', 'Frete grátis para todo o Brasil',
  '{"nome": "SAC Magazine Luiza", "email": "sac@magazineluiza.com.br", "telefone": "(11) 3504-2500"}',
  'smartphone-samsung-group', 8, '12 meses', 12, 0, 6.5, 4.8, 35,
  '[]',
  NOW(), NOW()
);
