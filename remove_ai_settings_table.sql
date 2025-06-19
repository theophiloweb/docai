-- Script para remover a tabela AISettings
-- Este script remove a tabela AISettings do banco de dados,
-- já que as configurações de IA agora são armazenadas no arquivo .env

-- Verificar se a tabela existe antes de tentar removê-la
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'AISettings') THEN
        DROP TABLE "AISettings";
        RAISE NOTICE 'Tabela AISettings removida com sucesso.';
    ELSE
        RAISE NOTICE 'Tabela AISettings não existe.';
    END IF;
    
    -- Verificar também a versão em minúsculas
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ai_settings') THEN
        DROP TABLE "ai_settings";
        RAISE NOTICE 'Tabela ai_settings removida com sucesso.';
    ELSE
        RAISE NOTICE 'Tabela ai_settings não existe.';
    END IF;
END $$;
