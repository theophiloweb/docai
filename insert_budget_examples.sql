-- Script para inserir dados de exemplo para grupos de orçamentos
-- Este script adiciona dados de exemplo para demonstrar a funcionalidade de agrupamento de orçamentos

-- Primeiro, vamos criar uma função para obter o ID do usuário cliente
DO $$
DECLARE
    client_id UUID;
    document_id UUID;
    notebook_group_id VARCHAR := 'notebook-dell-inspiron-group';
    smartphone_group_id VARCHAR := 'smartphone-samsung-s23-group';
    geladeira_group_id VARCHAR := 'geladeira-electrolux-group';
    tv_group_id VARCHAR := 'tv-samsung-4k-group';
BEGIN
    -- Obter ID do usuário cliente
    SELECT id INTO client_id FROM "Users" WHERE email = 'cliente@exemplo.com' LIMIT 1;
    
    -- Se não encontrar o usuário, usar um ID genérico
    IF client_id IS NULL THEN
        client_id := '00000000-0000-0000-0000-000000000000'::UUID;
    END IF;
    
    -- Obter ID de um documento existente ou criar um novo
    SELECT id INTO document_id FROM "Documents" WHERE user_id = client_id LIMIT 1;
    
    -- Se não encontrar documento, usar um ID genérico
    IF document_id IS NULL THEN
        document_id := '00000000-0000-0000-0000-000000000001'::UUID;
    END IF;
    
    -- Limpar registros existentes com os mesmos group_ids para evitar duplicação
    DELETE FROM "BudgetRecords" WHERE group_id IN (notebook_group_id, smartphone_group_id, geladeira_group_id, tv_group_id);
    
    -- Inserir orçamentos para Notebook Dell Inspiron
    INSERT INTO "BudgetRecords" (
        id, document_id, user_id, title, provider, provider_cnpj, issue_date, valid_until, 
        total_amount, currency, category, status, items, payment_terms, delivery_terms, 
        notes, contact_info, group_id, delivery_time, warranty, warranty_months, 
        shipping_cost, reclame_aqui_score, product_rating, depreciation, risk_factors,
        created_at, updated_at
    ) VALUES 
    (
        gen_random_uuid(), document_id, client_id,
        'Notebook Dell Inspiron 15', 'Dell Computadores', '72.381.189/0001-10',
        '2025-05-15', '2025-06-15', 4599.90, 'BRL', 'tecnologia', 'pendente',
        '[{"description": "Notebook Dell Inspiron 15 3000", "quantity": 1, "unitPrice": 4599.90}]',
        'À vista ou em até 12x sem juros', 'Entrega em até 10 dias úteis',
        'Inclui garantia de 1 ano',
        '{"nome": "Atendimento Dell", "email": "vendas@dell.com", "telefone": "(11) 4004-0000"}',
        notebook_group_id, 10, '12 meses', 12, 0, 7.8, 4.5, 25,
        ARRAY['Modelo com mais de 6 meses no mercado'],
        NOW(), NOW()
    ),
    (
        gen_random_uuid(), document_id, client_id,
        'Notebook Dell Inspiron 15', 'Magazine Luiza', '47.960.950/0001-21',
        '2025-05-20', '2025-06-20', 4799.90, 'BRL', 'tecnologia', 'pendente',
        '[{"description": "Notebook Dell Inspiron 15 3000", "quantity": 1, "unitPrice": 4799.90}]',
        'À vista ou em até 10x sem juros', 'Entrega em até 15 dias úteis',
        'Frete grátis para todo o Brasil',
        '{"nome": "SAC Magazine Luiza", "email": "sac@magazineluiza.com.br", "telefone": "(11) 3504-2500"}',
        notebook_group_id, 15, '12 meses', 12, 0, 6.5, 4.5, 25,
        ARRAY['Preço acima da média', 'Tempo de entrega longo'],
        NOW(), NOW()
    ),
    (
        gen_random_uuid(), document_id, client_id,
        'Notebook Dell Inspiron 15', 'Amazon Brasil', '15.436.940/0001-03',
        '2025-05-22', '2025-06-22', 4499.90, 'BRL', 'tecnologia', 'pendente',
        '[{"description": "Notebook Dell Inspiron 15 3000", "quantity": 1, "unitPrice": 4499.90}]',
        'À vista ou em até 12x sem juros', 'Entrega em até 3 dias úteis',
        'Amazon Prime: entrega expressa',
        '{"nome": "Atendimento Amazon", "email": "atendimento@amazon.com.br", "telefone": "(11) 4004-1999"}',
        notebook_group_id, 3, '12 meses', 12, 0, 8.2, 4.5, 25,
        ARRAY[],
        NOW(), NOW()
    );
    
    -- Inserir orçamentos para Smartphone Samsung Galaxy S23
    INSERT INTO "BudgetRecords" (
        id, document_id, user_id, title, provider, provider_cnpj, issue_date, valid_until, 
        total_amount, currency, category, status, items, payment_terms, delivery_terms, 
        notes, contact_info, group_id, delivery_time, warranty, warranty_months, 
        shipping_cost, reclame_aqui_score, product_rating, depreciation, risk_factors,
        created_at, updated_at
    ) VALUES 
    (
        gen_random_uuid(), document_id, client_id,
        'Smartphone Samsung Galaxy S23', 'Magazine Luiza', '47.960.950/0001-21',
        '2025-06-01', '2025-07-01', 3999.90, 'BRL', 'tecnologia', 'pendente',
        '[{"description": "Smartphone Samsung Galaxy S23 128GB", "quantity": 1, "unitPrice": 3999.90}]',
        'À vista ou em até 12x sem juros', 'Entrega em até 5 dias úteis',
        'Frete grátis para todo o Brasil',
        '{"nome": "SAC Magazine Luiza", "email": "sac@magazineluiza.com.br", "telefone": "(11) 3504-2500"}',
        smartphone_group_id, 5, '12 meses', 12, 0, 6.5, 4.7, 30,
        ARRAY['Preço acima da média'],
        NOW(), NOW()
    ),
    (
        gen_random_uuid(), document_id, client_id,
        'Smartphone Samsung Galaxy S23', 'Amazon Brasil', '15.436.940/0001-03',
        '2025-06-03', '2025-07-03', 3899.90, 'BRL', 'tecnologia', 'pendente',
        '[{"description": "Smartphone Samsung Galaxy S23 128GB", "quantity": 1, "unitPrice": 3899.90}]',
        'À vista ou em até 10x sem juros', 'Entrega em até 2 dias úteis',
        'Amazon Prime: entrega expressa',
        '{"nome": "Atendimento Amazon", "email": "atendimento@amazon.com.br", "telefone": "(11) 4004-1999"}',
        smartphone_group_id, 2, '12 meses', 12, 0, 8.2, 4.7, 30,
        ARRAY[],
        NOW(), NOW()
    ),
    (
        gen_random_uuid(), document_id, client_id,
        'Smartphone Samsung Galaxy S23', 'Samsung Store', '00.280.273/0001-37',
        '2025-06-05', '2025-07-05', 4099.90, 'BRL', 'tecnologia', 'pendente',
        '[{"description": "Smartphone Samsung Galaxy S23 128GB", "quantity": 1, "unitPrice": 4099.90}]',
        'À vista ou em até 12x sem juros', 'Entrega em até 3 dias úteis',
        'Garantia estendida disponível',
        '{"nome": "Samsung Store", "email": "atendimento@samsung.com.br", "telefone": "(11) 4004-0000"}',
        smartphone_group_id, 3, '12 meses', 12, 0, 8.7, 4.7, 30,
        ARRAY['Preço premium'],
        NOW(), NOW()
    );
    
    -- Inserir orçamentos para Geladeira Electrolux
    INSERT INTO "BudgetRecords" (
        id, document_id, user_id, title, provider, provider_cnpj, issue_date, valid_until, 
        total_amount, currency, category, status, items, payment_terms, delivery_terms, 
        notes, contact_info, group_id, delivery_time, warranty, warranty_months, 
        shipping_cost, reclame_aqui_score, product_rating, depreciation, risk_factors,
        created_at, updated_at
    ) VALUES 
    (
        gen_random_uuid(), document_id, client_id,
        'Geladeira Electrolux Frost Free', 'Casas Bahia', '33.041.260/0652-90',
        '2025-06-02', '2025-07-02', 3299.90, 'BRL', 'eletrodomestico', 'pendente',
        '[{"description": "Geladeira Electrolux Frost Free 382L", "quantity": 1, "unitPrice": 3299.90}]',
        'À vista ou em até 12x sem juros', 'Entrega em até 10 dias úteis',
        'Instalação não inclusa',
        '{"nome": "SAC Casas Bahia", "email": "sac@casasbahia.com.br", "telefone": "(11) 3003-8889"}',
        geladeira_group_id, 10, '12 meses', 12, 150, 7.2, 4.5, 18,
        ARRAY[],
        NOW(), NOW()
    ),
    (
        gen_random_uuid(), document_id, client_id,
        'Geladeira Electrolux Frost Free', 'Fast Shop', '43.708.379/0001-00',
        '2025-06-03', '2025-07-03', 3399.90, 'BRL', 'eletrodomestico', 'pendente',
        '[{"description": "Geladeira Electrolux Frost Free 382L", "quantity": 1, "unitPrice": 3399.90}]',
        'À vista com 5% de desconto ou em até 10x sem juros', 'Entrega em até 7 dias úteis',
        'Instalação gratuita',
        '{"nome": "SAC Fast Shop", "email": "sac@fastshop.com.br", "telefone": "(11) 3003-3728"}',
        geladeira_group_id, 7, '12 meses', 12, 0, 8.5, 4.5, 18,
        ARRAY[],
        NOW(), NOW()
    );
    
    -- Inserir orçamentos para TV Samsung 4K
    INSERT INTO "BudgetRecords" (
        id, document_id, user_id, title, provider, provider_cnpj, issue_date, valid_until, 
        total_amount, currency, category, status, items, payment_terms, delivery_terms, 
        notes, contact_info, group_id, delivery_time, warranty, warranty_months, 
        shipping_cost, reclame_aqui_score, product_rating, depreciation, risk_factors,
        created_at, updated_at
    ) VALUES 
    (
        gen_random_uuid(), document_id, client_id,
        'TV Samsung 4K 50 polegadas', 'Magazine Luiza', '47.960.950/0001-21',
        '2025-06-10', '2025-07-10', 2799.90, 'BRL', 'eletronico', 'pendente',
        '[{"description": "Smart TV Samsung Crystal UHD 4K 50 polegadas", "quantity": 1, "unitPrice": 2799.90}]',
        'À vista ou em até 12x sem juros', 'Entrega em até 7 dias úteis',
        'Frete grátis para todo o Brasil',
        '{"nome": "SAC Magazine Luiza", "email": "sac@magazineluiza.com.br", "telefone": "(11) 3504-2500"}',
        tv_group_id, 7, '12 meses', 12, 0, 6.5, 4.8, 22,
        ARRAY[],
        NOW(), NOW()
    ),
    (
        gen_random_uuid(), document_id, client_id,
        'TV Samsung 4K 50 polegadas', 'Amazon Brasil', '15.436.940/0001-03',
        '2025-06-12', '2025-07-12', 2699.90, 'BRL', 'eletronico', 'pendente',
        '[{"description": "Smart TV Samsung Crystal UHD 4K 50 polegadas", "quantity": 1, "unitPrice": 2699.90}]',
        'À vista ou em até 10x sem juros', 'Entrega em até 3 dias úteis',
        'Amazon Prime: entrega expressa',
        '{"nome": "Atendimento Amazon", "email": "atendimento@amazon.com.br", "telefone": "(11) 4004-1999"}',
        tv_group_id, 3, '12 meses', 12, 0, 8.2, 4.8, 22,
        ARRAY[],
        NOW(), NOW()
    ),
    (
        gen_random_uuid(), document_id, client_id,
        'TV Samsung 4K 50 polegadas', 'Samsung Store', '00.280.273/0001-37',
        '2025-06-15', '2025-07-15', 2899.90, 'BRL', 'eletronico', 'pendente',
        '[{"description": "Smart TV Samsung Crystal UHD 4K 50 polegadas", "quantity": 1, "unitPrice": 2899.90}]',
        'À vista ou em até 12x sem juros', 'Entrega em até 5 dias úteis',
        'Garantia estendida disponível',
        '{"nome": "Samsung Store", "email": "atendimento@samsung.com.br", "telefone": "(11) 4004-0000"}',
        tv_group_id, 5, '24 meses', 24, 0, 8.7, 4.8, 22,
        ARRAY['Preço premium', 'Garantia estendida incluída'],
        NOW(), NOW()
    );
    
    RAISE NOTICE 'Dados de exemplo de orçamentos inseridos com sucesso!';
END $$;
