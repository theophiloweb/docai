-- Inserir registros de orçamentos para o usuário cliente@exemplo.com
DO $$
DECLARE
    notebook_dell_id UUID;
    notebook_hp_id UUID;
    notebook_lenovo_id UUID;
    reforma_cozinha_a_id UUID;
    reforma_cozinha_b_id UUID;
    seguro_auto_a_id UUID;
    seguro_auto_b_id UUID;
    seguro_auto_c_id UUID;
    plano_saude_a_id UUID;
    plano_saude_b_id UUID;
    moveis_sala_a_id UUID;
    moveis_sala_b_id UUID;
    client_id UUID := 'b0f4e76d-0326-4318-a9a8-62779b061ac8'::UUID;
BEGIN
    -- Obter IDs dos documentos
    SELECT id INTO notebook_dell_id FROM "Documents" WHERE user_id = client_id AND title = 'Orçamento - Notebook Dell';
    SELECT id INTO notebook_hp_id FROM "Documents" WHERE user_id = client_id AND title = 'Orçamento - Notebook HP';
    SELECT id INTO notebook_lenovo_id FROM "Documents" WHERE user_id = client_id AND title = 'Orçamento - Notebook Lenovo';
    
    SELECT id INTO reforma_cozinha_a_id FROM "Documents" WHERE user_id = client_id AND title = 'Orçamento - Reforma Cozinha A';
    SELECT id INTO reforma_cozinha_b_id FROM "Documents" WHERE user_id = client_id AND title = 'Orçamento - Reforma Cozinha B';
    
    SELECT id INTO seguro_auto_a_id FROM "Documents" WHERE user_id = client_id AND title = 'Orçamento - Seguro Auto A';
    SELECT id INTO seguro_auto_b_id FROM "Documents" WHERE user_id = client_id AND title = 'Orçamento - Seguro Auto B';
    SELECT id INTO seguro_auto_c_id FROM "Documents" WHERE user_id = client_id AND title = 'Orçamento - Seguro Auto C';
    
    SELECT id INTO plano_saude_a_id FROM "Documents" WHERE user_id = client_id AND title = 'Orçamento - Plano de Saúde A';
    SELECT id INTO plano_saude_b_id FROM "Documents" WHERE user_id = client_id AND title = 'Orçamento - Plano de Saúde B';
    
    SELECT id INTO moveis_sala_a_id FROM "Documents" WHERE user_id = client_id AND title = 'Orçamento - Móveis Sala A';
    SELECT id INTO moveis_sala_b_id FROM "Documents" WHERE user_id = client_id AND title = 'Orçamento - Móveis Sala B';
    
    -- Inserir orçamentos de notebooks
    IF notebook_dell_id IS NOT NULL THEN
        INSERT INTO "BudgetRecords" (
            id, document_id, user_id, title, provider, provider_c_n_p_j, issue_date, valid_until,
            total_amount, currency, category, status, items, payment_terms, delivery_terms,
            notes, contact_info, competing_quotes, created_at, updated_at
        ) VALUES (
            gen_random_uuid(), notebook_dell_id, client_id, 'Notebook Dell XPS 13', 'Dell Computadores',
            '72.381.189/0001-10', '2025-05-10', '2025-06-10',
            8799.90, 'BRL', 'tecnologia', 'pendente',
            '[{"name": "Notebook Dell XPS 13", "description": "Intel Core i7, 16GB RAM, 512GB SSD", "quantity": 1, "unit_price": 8799.90}]',
            'Pagamento em até 12x sem juros', 'Entrega em até 7 dias úteis',
            'Garantia de 1 ano', '{"name": "Carlos Vendas", "email": "carlos@dell.com", "phone": "(11) 99999-8888"}',
            '[]', '2025-05-10 10:00:00', '2025-05-10 10:00:00'
        );
    END IF;
    
    IF notebook_hp_id IS NOT NULL THEN
        INSERT INTO "BudgetRecords" (
            id, document_id, user_id, title, provider, provider_c_n_p_j, issue_date, valid_until,
            total_amount, currency, category, status, items, payment_terms, delivery_terms,
            notes, contact_info, competing_quotes, created_at, updated_at
        ) VALUES (
            gen_random_uuid(), notebook_hp_id, client_id, 'Notebook HP Spectre x360', 'HP Brasil',
            '61.797.924/0001-55', '2025-05-10', '2025-06-10',
            8499.90, 'BRL', 'tecnologia', 'pendente',
            '[{"name": "Notebook HP Spectre x360", "description": "Intel Core i7, 16GB RAM, 512GB SSD", "quantity": 1, "unit_price": 8499.90}]',
            'Pagamento em até 10x sem juros', 'Entrega em até 10 dias úteis',
            'Garantia de 1 ano', '{"name": "Ana Vendas", "email": "ana@hp.com", "phone": "(11) 99999-7777"}',
            '[]', '2025-05-10 11:00:00', '2025-05-10 11:00:00'
        );
    END IF;
    
    IF notebook_lenovo_id IS NOT NULL THEN
        INSERT INTO "BudgetRecords" (
            id, document_id, user_id, title, provider, provider_c_n_p_j, issue_date, valid_until,
            total_amount, currency, category, status, items, payment_terms, delivery_terms,
            notes, contact_info, competing_quotes, created_at, updated_at
        ) VALUES (
            gen_random_uuid(), notebook_lenovo_id, client_id, 'Notebook Lenovo ThinkPad X1', 'Lenovo Brasil',
            '07.275.920/0001-61', '2025-05-10', '2025-06-10',
            9299.90, 'BRL', 'tecnologia', 'pendente',
            '[{"name": "Notebook Lenovo ThinkPad X1", "description": "Intel Core i7, 16GB RAM, 512GB SSD", "quantity": 1, "unit_price": 9299.90}]',
            'Pagamento em até 12x sem juros', 'Entrega em até 5 dias úteis',
            'Garantia de 3 anos', '{"name": "Pedro Vendas", "email": "pedro@lenovo.com", "phone": "(11) 99999-6666"}',
            '[]', '2025-05-10 12:00:00', '2025-05-10 12:00:00'
        );
    END IF;
    
    -- Inserir orçamentos de reforma de cozinha
    IF reforma_cozinha_a_id IS NOT NULL THEN
        INSERT INTO "BudgetRecords" (
            id, document_id, user_id, title, provider, provider_c_n_p_j, issue_date, valid_until,
            total_amount, currency, category, status, items, payment_terms, delivery_terms,
            notes, contact_info, competing_quotes, created_at, updated_at
        ) VALUES (
            gen_random_uuid(), reforma_cozinha_a_id, client_id, 'Reforma Completa de Cozinha', 'Reformas Express',
            '45.678.901/0001-23', '2025-04-15', '2025-05-15',
            25000.00, 'BRL', 'reforma', 'aprovado',
            '[
                {"name": "Armários Planejados", "description": "MDF branco com acabamento em vidro", "quantity": 1, "unit_price": 12000.00},
                {"name": "Bancada de Granito", "description": "Granito preto São Gabriel", "quantity": 1, "unit_price": 5000.00},
                {"name": "Instalação Elétrica", "description": "Revisão completa da parte elétrica", "quantity": 1, "unit_price": 3000.00},
                {"name": "Instalação Hidráulica", "description": "Revisão completa da parte hidráulica", "quantity": 1, "unit_price": 2500.00},
                {"name": "Mão de Obra", "description": "Serviço completo de instalação", "quantity": 1, "unit_price": 2500.00}
            ]',
            'Entrada de 50% e restante em 5x', 'Prazo de execução: 30 dias',
            'Inclui limpeza pós-obra', '{"name": "Roberto Construções", "email": "roberto@reformasexpress.com", "phone": "(11) 98888-7777"}',
            '[]', '2025-04-15 10:00:00', '2025-04-15 10:00:00'
        );
    END IF;
    
    IF reforma_cozinha_b_id IS NOT NULL THEN
        INSERT INTO "BudgetRecords" (
            id, document_id, user_id, title, provider, provider_c_n_p_j, issue_date, valid_until,
            total_amount, currency, category, status, items, payment_terms, delivery_terms,
            notes, contact_info, competing_quotes, created_at, updated_at
        ) VALUES (
            gen_random_uuid(), reforma_cozinha_b_id, client_id, 'Reforma Completa de Cozinha', 'Cozinhas Modernas',
            '56.789.012/0001-34', '2025-04-15', '2025-05-15',
            28500.00, 'BRL', 'reforma', 'rejeitado',
            '[
                {"name": "Armários Planejados", "description": "MDF branco com acabamento em vidro", "quantity": 1, "unit_price": 14000.00},
                {"name": "Bancada de Granito", "description": "Granito preto São Gabriel", "quantity": 1, "unit_price": 5500.00},
                {"name": "Instalação Elétrica", "description": "Revisão completa da parte elétrica", "quantity": 1, "unit_price": 3500.00},
                {"name": "Instalação Hidráulica", "description": "Revisão completa da parte hidráulica", "quantity": 1, "unit_price": 3000.00},
                {"name": "Mão de Obra", "description": "Serviço completo de instalação", "quantity": 1, "unit_price": 2500.00}
            ]',
            'Entrada de 30% e restante em 10x', 'Prazo de execução: 25 dias',
            'Inclui limpeza pós-obra e garantia de 5 anos', '{"name": "Marcelo Construções", "email": "marcelo@cozinhasmodernas.com", "phone": "(11) 97777-6666"}',
            '[]', '2025-04-15 11:00:00', '2025-04-15 11:00:00'
        );
    END IF;
    
    -- Inserir orçamentos de seguro auto
    IF seguro_auto_a_id IS NOT NULL THEN
        INSERT INTO "BudgetRecords" (
            id, document_id, user_id, title, provider, provider_c_n_p_j, issue_date, valid_until,
            total_amount, currency, category, status, items, payment_terms, delivery_terms,
            notes, contact_info, competing_quotes, created_at, updated_at
        ) VALUES (
            gen_random_uuid(), seguro_auto_a_id, client_id, 'Seguro Auto - Cobertura Completa', 'Seguros Confiança',
            '67.890.123/0001-45', '2025-03-20', '2025-04-20',
            3200.00, 'BRL', 'seguro', 'aprovado',
            '[{"name": "Seguro Auto Completo", "description": "Cobertura total para Honda Civic 2023", "quantity": 1, "unit_price": 3200.00}]',
            'Pagamento em até 12x sem juros', 'Vigência imediata após pagamento',
            'Cobertura: Roubo, furto, colisão, terceiros até R$ 100.000', '{"name": "Juliana Seguros", "email": "juliana@segurosconfianca.com", "phone": "(11) 96666-5555"}',
            '[]', '2025-03-20 10:00:00', '2025-03-20 10:00:00'
        );
    END IF;
    
    IF seguro_auto_b_id IS NOT NULL THEN
        INSERT INTO "BudgetRecords" (
            id, document_id, user_id, title, provider, provider_c_n_p_j, issue_date, valid_until,
            total_amount, currency, category, status, items, payment_terms, delivery_terms,
            notes, contact_info, competing_quotes, created_at, updated_at
        ) VALUES (
            gen_random_uuid(), seguro_auto_b_id, client_id, 'Seguro Auto - Cobertura Completa', 'Seguros Proteção',
            '78.901.234/0001-56', '2025-03-20', '2025-04-20',
            2950.00, 'BRL', 'seguro', 'rejeitado',
            '[{"name": "Seguro Auto Completo", "description": "Cobertura total para Honda Civic 2023", "quantity": 1, "unit_price": 2950.00}]',
            'Pagamento em até 10x sem juros', 'Vigência imediata após pagamento',
            'Cobertura: Roubo, furto, colisão, terceiros até R$ 80.000', '{"name": "Ricardo Seguros", "email": "ricardo@segurosprotecao.com", "phone": "(11) 95555-4444"}',
            '[]', '2025-03-20 11:00:00', '2025-03-20 11:00:00'
        );
    END IF;
    
    IF seguro_auto_c_id IS NOT NULL THEN
        INSERT INTO "BudgetRecords" (
            id, document_id, user_id, title, provider, provider_c_n_p_j, issue_date, valid_until,
            total_amount, currency, category, status, items, payment_terms, delivery_terms,
            notes, contact_info, competing_quotes, created_at, updated_at
        ) VALUES (
            gen_random_uuid(), seguro_auto_c_id, client_id, 'Seguro Auto - Cobertura Completa', 'Seguros Total',
            '89.012.345/0001-67', '2025-03-20', '2025-04-20',
            3500.00, 'BRL', 'seguro', 'expirado',
            '[{"name": "Seguro Auto Completo", "description": "Cobertura total para Honda Civic 2023", "quantity": 1, "unit_price": 3500.00}]',
            'Pagamento em até 12x sem juros', 'Vigência imediata após pagamento',
            'Cobertura: Roubo, furto, colisão, terceiros até R$ 150.000, carro reserva por 30 dias', '{"name": "Fernanda Seguros", "email": "fernanda@segurostotal.com", "phone": "(11) 94444-3333"}',
            '[]', '2025-03-20 12:00:00', '2025-03-20 12:00:00'
        );
    END IF;
    
    -- Inserir orçamentos de plano de saúde
    IF plano_saude_a_id IS NOT NULL THEN
        INSERT INTO "BudgetRecords" (
            id, document_id, user_id, title, provider, provider_c_n_p_j, issue_date, valid_until,
            total_amount, currency, category, status, items, payment_terms, delivery_terms,
            notes, contact_info, competing_quotes, created_at, updated_at
        ) VALUES (
            gen_random_uuid(), plano_saude_a_id, client_id, 'Plano de Saúde Familiar', 'Saúde Total',
            '90.123.456/0001-78', '2025-02-10', '2025-03-10',
            1800.00, 'BRL', 'saude', 'pendente',
            '[{"name": "Plano Saúde Familiar", "description": "Cobertura nacional para família de 4 pessoas", "quantity": 1, "unit_price": 1800.00}]',
            'Pagamento mensal', 'Carência de 30 dias para consultas',
            'Cobertura: Consultas, exames, internações, cirurgias', '{"name": "Mariana Saúde", "email": "mariana@saudetotal.com", "phone": "(11) 93333-2222"}',
            '[]', '2025-02-10 10:00:00', '2025-02-10 10:00:00'
        );
    END IF;
    
    IF plano_saude_b_id IS NOT NULL THEN
        INSERT INTO "BudgetRecords" (
            id, document_id, user_id, title, provider, provider_c_n_p_j, issue_date, valid_until,
            total_amount, currency, category, status, items, payment_terms, delivery_terms,
            notes, contact_info, competing_quotes, created_at, updated_at
        ) VALUES (
            gen_random_uuid(), plano_saude_b_id, client_id, 'Plano de Saúde Familiar', 'Vida Saudável',
            '01.234.567/0001-89', '2025-02-10', '2025-03-10',
            2100.00, 'BRL', 'saude', 'pendente',
            '[{"name": "Plano Saúde Familiar Premium", "description": "Cobertura nacional para família de 4 pessoas", "quantity": 1, "unit_price": 2100.00}]',
            'Pagamento mensal', 'Carência de 15 dias para consultas',
            'Cobertura: Consultas, exames, internações, cirurgias, atendimento domiciliar', '{"name": "Felipe Saúde", "email": "felipe@vidasaudavel.com", "phone": "(11) 92222-1111"}',
            '[]', '2025-02-10 11:00:00', '2025-02-10 11:00:00'
        );
    END IF;
    
    -- Inserir orçamentos de móveis
    IF moveis_sala_a_id IS NOT NULL THEN
        INSERT INTO "BudgetRecords" (
            id, document_id, user_id, title, provider, provider_c_n_p_j, issue_date, valid_until,
            total_amount, currency, category, status, items, payment_terms, delivery_terms,
            notes, contact_info, competing_quotes, created_at, updated_at
        ) VALUES (
            gen_random_uuid(), moveis_sala_a_id, client_id, 'Conjunto Móveis Sala', 'Móveis Elegantes',
            '12.345.678/0001-90', '2025-01-15', '2025-02-15',
            5800.00, 'BRL', 'moveis', 'convertido',
            '[
                {"name": "Sofá 3 lugares", "description": "Tecido suede cinza", "quantity": 1, "unit_price": 2800.00},
                {"name": "Mesa de Centro", "description": "Madeira maciça com tampo de vidro", "quantity": 1, "unit_price": 1200.00},
                {"name": "Rack para TV", "description": "MDF com acabamento em laca", "quantity": 1, "unit_price": 1800.00}
            ]',
            'Entrada de 30% e restante em 10x', 'Entrega em até 20 dias úteis',
            'Garantia de 1 ano', '{"name": "Luciana Móveis", "email": "luciana@moveiselegantes.com", "phone": "(11) 91111-0000"}',
            '[]', '2025-01-15 10:00:00', '2025-01-15 10:00:00'
        );
    END IF;
    
    IF moveis_sala_b_id IS NOT NULL THEN
        INSERT INTO "BudgetRecords" (
            id, document_id, user_id, title, provider, provider_c_n_p_j, issue_date, valid_until,
            total_amount, currency, category, status, items, payment_terms, delivery_terms,
            notes, contact_info, competing_quotes, created_at, updated_at
        ) VALUES (
            gen_random_uuid(), moveis_sala_b_id, client_id, 'Conjunto Móveis Sala', 'Móveis Modernos',
            '23.456.789/0001-01', '2025-01-15', '2025-02-15',
            6500.00, 'BRL', 'moveis', 'expirado',
            '[
                {"name": "Sofá 3 lugares", "description": "Couro sintético preto", "quantity": 1, "unit_price": 3200.00},
                {"name": "Mesa de Centro", "description": "Madeira maciça com tampo de vidro", "quantity": 1, "unit_price": 1500.00},
                {"name": "Rack para TV", "description": "MDF com acabamento em laca", "quantity": 1, "unit_price": 1800.00}
            ]',
            'Entrada de 20% e restante em 12x', 'Entrega em até 15 dias úteis',
            'Garantia de 2 anos', '{"name": "Gabriel Móveis", "email": "gabriel@moveismodernos.com", "phone": "(11) 90000-9999"}',
            '[]', '2025-01-15 11:00:00', '2025-01-15 11:00:00'
        );
    END IF;
    
END $$;
