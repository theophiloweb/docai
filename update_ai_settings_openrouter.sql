-- Atualizar configurações de IA para usar OpenRouter com Llama 4
UPDATE "AISettings" 
SET 
  api_url = 'https://openrouter.ai/api/v1/chat/completions',
  model = 'meta-llama/llama-4-maverick:free',
  is_active = true,
  settings = jsonb_build_object(
    'http_referer', 'https://docai.com.br',
    'x_title', 'Doc.AI'
  )
WHERE provider = 'llama';

-- Desativar outros provedores para garantir que apenas o Llama seja usado
UPDATE "AISettings"
SET is_active = false
WHERE provider != 'llama';
