-- Atualizar configurações de IA para usar um endpoint local válido
UPDATE "AISettings" 
SET 
  api_url = 'http://localhost:8080/v1/chat/completions',
  is_active = true
WHERE provider = 'llama';

-- Desativar outros provedores para garantir que apenas o Llama seja usado
UPDATE "AISettings"
SET is_active = false
WHERE provider != 'llama';

-- Verificar se existe pelo menos uma configuração para Llama
INSERT INTO "AISettings" (
  id, 
  name, 
  provider, 
  api_key, 
  api_url, 
  model, 
  max_tokens, 
  temperature, 
  is_active, 
  settings, 
  usage_limit, 
  usage_count, 
  last_used, 
  created_at, 
  updated_at
)
SELECT 
  gen_random_uuid(), 
  'Llama Local', 
  'llama', 
  'local-dev-key', 
  'http://localhost:8080/v1/chat/completions', 
  'llama-3', 
  2000, 
  0.7, 
  true, 
  '{}', 
  10000, 
  0, 
  NOW(), 
  NOW(), 
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM "AISettings" WHERE provider = 'llama'
);
