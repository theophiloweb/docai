-- Inserir registros financeiros para o usuário cliente@exemplo.com
-- Primeiro, vamos obter os IDs dos documentos inseridos
DO $$
DECLARE
    extrato_jan_id UUID;
    extrato_fev_id UUID;
    extrato_mar_id UUID;
    extrato_abr_id UUID;
    extrato_mai_id UUID;
    fatura_jan_id UUID;
    fatura_fev_id UUID;
    fatura_mar_id UUID;
    fatura_abr_id UUID;
    fatura_mai_id UUID;
    recibo_jan_id UUID;
    recibo_fev_id UUID;
    recibo_mar_id UUID;
    recibo_abr_id UUID;
    recibo_mai_id UUID;
    user_id UUID := 'b0f4e76d-0326-4318-a9a8-62779b061ac8'::UUID;
BEGIN
    -- Obter IDs dos documentos
    SELECT id INTO extrato_jan_id FROM "Documents" WHERE user_id = user_id AND title = 'Extrato Bancário - Janeiro 2025';
    SELECT id INTO extrato_fev_id FROM "Documents" WHERE user_id = user_id AND title = 'Extrato Bancário - Fevereiro 2025';
    SELECT id INTO extrato_mar_id FROM "Documents" WHERE user_id = user_id AND title = 'Extrato Bancário - Março 2025';
    SELECT id INTO extrato_abr_id FROM "Documents" WHERE user_id = user_id AND title = 'Extrato Bancário - Abril 2025';
    SELECT id INTO extrato_mai_id FROM "Documents" WHERE user_id = user_id AND title = 'Extrato Bancário - Maio 2025';
    
    SELECT id INTO fatura_jan_id FROM "Documents" WHERE user_id = user_id AND title = 'Fatura Cartão - Janeiro 2025';
    SELECT id INTO fatura_fev_id FROM "Documents" WHERE user_id = user_id AND title = 'Fatura Cartão - Fevereiro 2025';
    SELECT id INTO fatura_mar_id FROM "Documents" WHERE user_id = user_id AND title = 'Fatura Cartão - Março 2025';
    SELECT id INTO fatura_abr_id FROM "Documents" WHERE user_id = user_id AND title = 'Fatura Cartão - Abril 2025';
    SELECT id INTO fatura_mai_id FROM "Documents" WHERE user_id = user_id AND title = 'Fatura Cartão - Maio 2025';
    
    SELECT id INTO recibo_jan_id FROM "Documents" WHERE user_id = user_id AND title = 'Recibo Aluguel - Janeiro 2025';
    SELECT id INTO recibo_fev_id FROM "Documents" WHERE user_id = user_id AND title = 'Recibo Aluguel - Fevereiro 2025';
    SELECT id INTO recibo_mar_id FROM "Documents" WHERE user_id = user_id AND title = 'Recibo Aluguel - Março 2025';
    SELECT id INTO recibo_abr_id FROM "Documents" WHERE user_id = user_id AND title = 'Recibo Aluguel - Abril 2025';
    SELECT id INTO recibo_mai_id FROM "Documents" WHERE user_id = user_id AND title = 'Recibo Aluguel - Maio 2025';
    
    -- Inserir transações de salário (receitas)
    IF extrato_jan_id IS NOT NULL THEN
        INSERT INTO "FinancialRecords" (
            id, document_id, user_id, record_type, transaction_date, amount, 
            currency, description, category, payment_method, establishment,
            is_expense, is_recurring, created_at, updated_at
        ) VALUES (
            gen_random_uuid(), extrato_jan_id, user_id, 'extrato_bancario'::enum_FinancialRecords_record_type,
            '2025-01-05', 4500.00, 'BRL', 'Salário', 'salario', 'transferência', 'Empresa ABC',
            false, true, '2025-01-05 10:00:00', '2025-01-05 10:00:00'
        );
    END IF;
    
    IF extrato_fev_id IS NOT NULL THEN
        INSERT INTO "FinancialRecords" (
            id, document_id, user_id, record_type, transaction_date, amount, 
            currency, description, category, payment_method, establishment,
            is_expense, is_recurring, created_at, updated_at
        ) VALUES (
            gen_random_uuid(), extrato_fev_id, user_id, 'extrato_bancario'::enum_FinancialRecords_record_type,
            '2025-02-05', 4500.00, 'BRL', 'Salário', 'salario', 'transferência', 'Empresa ABC',
            false, true, '2025-02-05 10:00:00', '2025-02-05 10:00:00'
        );
    END IF;
    
    IF extrato_mar_id IS NOT NULL THEN
        INSERT INTO "FinancialRecords" (
            id, document_id, user_id, record_type, transaction_date, amount, 
            currency, description, category, payment_method, establishment,
            is_expense, is_recurring, created_at, updated_at
        ) VALUES (
            gen_random_uuid(), extrato_mar_id, user_id, 'extrato_bancario'::enum_FinancialRecords_record_type,
            '2025-03-05', 4500.00, 'BRL', 'Salário', 'salario', 'transferência', 'Empresa ABC',
            false, true, '2025-03-05 10:00:00', '2025-03-05 10:00:00'
        );
    END IF;
    
    IF extrato_abr_id IS NOT NULL THEN
        INSERT INTO "FinancialRecords" (
            id, document_id, user_id, record_type, transaction_date, amount, 
            currency, description, category, payment_method, establishment,
            is_expense, is_recurring, created_at, updated_at
        ) VALUES (
            gen_random_uuid(), extrato_abr_id, user_id, 'extrato_bancario'::enum_FinancialRecords_record_type,
            '2025-04-05', 4500.00, 'BRL', 'Salário', 'salario', 'transferência', 'Empresa ABC',
            false, true, '2025-04-05 10:00:00', '2025-04-05 10:00:00'
        );
    END IF;
    
    IF extrato_mai_id IS NOT NULL THEN
        INSERT INTO "FinancialRecords" (
            id, document_id, user_id, record_type, transaction_date, amount, 
            currency, description, category, payment_method, establishment,
            is_expense, is_recurring, created_at, updated_at
        ) VALUES (
            gen_random_uuid(), extrato_mai_id, user_id, 'extrato_bancario'::enum_FinancialRecords_record_type,
            '2025-05-05', 4500.00, 'BRL', 'Salário', 'salario', 'transferência', 'Empresa ABC',
            false, true, '2025-05-05 10:00:00', '2025-05-05 10:00:00'
        );
    END IF;
    
    -- Inserir transações de aluguel (despesas)
    IF recibo_jan_id IS NOT NULL THEN
        INSERT INTO "FinancialRecords" (
            id, document_id, user_id, record_type, transaction_date, amount, 
            currency, description, category, payment_method, establishment,
            is_expense, is_recurring, created_at, updated_at
        ) VALUES (
            gen_random_uuid(), recibo_jan_id, user_id, 'recibo'::enum_FinancialRecords_record_type,
            '2025-01-05', 1200.00, 'BRL', 'Aluguel', 'moradia', 'transferência', 'Imobiliária XYZ',
            true, true, '2025-01-05 10:00:00', '2025-01-05 10:00:00'
        );
    END IF;
    
    IF recibo_fev_id IS NOT NULL THEN
        INSERT INTO "FinancialRecords" (
            id, document_id, user_id, record_type, transaction_date, amount, 
            currency, description, category, payment_method, establishment,
            is_expense, is_recurring, created_at, updated_at
        ) VALUES (
            gen_random_uuid(), recibo_fev_id, user_id, 'recibo'::enum_FinancialRecords_record_type,
            '2025-02-05', 1200.00, 'BRL', 'Aluguel', 'moradia', 'transferência', 'Imobiliária XYZ',
            true, true, '2025-02-05 10:00:00', '2025-02-05 10:00:00'
        );
    END IF;
    
    IF recibo_mar_id IS NOT NULL THEN
        INSERT INTO "FinancialRecords" (
            id, document_id, user_id, record_type, transaction_date, amount, 
            currency, description, category, payment_method, establishment,
            is_expense, is_recurring, created_at, updated_at
        ) VALUES (
            gen_random_uuid(), recibo_mar_id, user_id, 'recibo'::enum_FinancialRecords_record_type,
            '2025-03-05', 1200.00, 'BRL', 'Aluguel', 'moradia', 'transferência', 'Imobiliária XYZ',
            true, true, '2025-03-05 10:00:00', '2025-03-05 10:00:00'
        );
    END IF;
    
    IF recibo_abr_id IS NOT NULL THEN
        INSERT INTO "FinancialRecords" (
            id, document_id, user_id, record_type, transaction_date, amount, 
            currency, description, category, payment_method, establishment,
            is_expense, is_recurring, created_at, updated_at
        ) VALUES (
            gen_random_uuid(), recibo_abr_id, user_id, 'recibo'::enum_FinancialRecords_record_type,
            '2025-04-05', 1200.00, 'BRL', 'Aluguel', 'moradia', 'transferência', 'Imobiliária XYZ',
            true, true, '2025-04-05 10:00:00', '2025-04-05 10:00:00'
        );
    END IF;
    
    IF recibo_mai_id IS NOT NULL THEN
        INSERT INTO "FinancialRecords" (
            id, document_id, user_id, record_type, transaction_date, amount, 
            currency, description, category, payment_method, establishment,
            is_expense, is_recurring, created_at, updated_at
        ) VALUES (
            gen_random_uuid(), recibo_mai_id, user_id, 'recibo'::enum_FinancialRecords_record_type,
            '2025-05-05', 1200.00, 'BRL', 'Aluguel', 'moradia', 'transferência', 'Imobiliária XYZ',
            true, true, '2025-05-05 10:00:00', '2025-05-05 10:00:00'
        );
    END IF;
    
    -- Inserir transações de supermercado (despesas)
    IF fatura_jan_id IS NOT NULL THEN
        INSERT INTO "FinancialRecords" (
            id, document_id, user_id, record_type, transaction_date, amount, 
            currency, description, category, payment_method, establishment,
            is_expense, is_recurring, created_at, updated_at
        ) VALUES (
            gen_random_uuid(), fatura_jan_id, user_id, 'fatura'::enum_FinancialRecords_record_type,
            '2025-01-15', 450.75, 'BRL', 'Supermercado', 'alimentacao', 'cartão de crédito', 'Supermercado Extra',
            true, false, '2025-01-15 10:00:00', '2025-01-15 10:00:00'
        );
    END IF;
    
    IF fatura_fev_id IS NOT NULL THEN
        INSERT INTO "FinancialRecords" (
            id, document_id, user_id, record_type, transaction_date, amount, 
            currency, description, category, payment_method, establishment,
            is_expense, is_recurring, created_at, updated_at
        ) VALUES (
            gen_random_uuid(), fatura_fev_id, user_id, 'fatura'::enum_FinancialRecords_record_type,
            '2025-02-15', 520.30, 'BRL', 'Supermercado', 'alimentacao', 'cartão de crédito', 'Supermercado Extra',
            true, false, '2025-02-15 10:00:00', '2025-02-15 10:00:00'
        );
    END IF;
    
    IF fatura_mar_id IS NOT NULL THEN
        INSERT INTO "FinancialRecords" (
            id, document_id, user_id, record_type, transaction_date, amount, 
            currency, description, category, payment_method, establishment,
            is_expense, is_recurring, created_at, updated_at
        ) VALUES (
            gen_random_uuid(), fatura_mar_id, user_id, 'fatura'::enum_FinancialRecords_record_type,
            '2025-03-15', 480.25, 'BRL', 'Supermercado', 'alimentacao', 'cartão de crédito', 'Supermercado Extra',
            true, false, '2025-03-15 10:00:00', '2025-03-15 10:00:00'
        );
    END IF;
    
    IF fatura_abr_id IS NOT NULL THEN
        INSERT INTO "FinancialRecords" (
            id, document_id, user_id, record_type, transaction_date, amount, 
            currency, description, category, payment_method, establishment,
            is_expense, is_recurring, created_at, updated_at
        ) VALUES (
            gen_random_uuid(), fatura_abr_id, user_id, 'fatura'::enum_FinancialRecords_record_type,
            '2025-04-15', 510.45, 'BRL', 'Supermercado', 'alimentacao', 'cartão de crédito', 'Supermercado Extra',
            true, false, '2025-04-15 10:00:00', '2025-04-15 10:00:00'
        );
    END IF;
    
    IF fatura_mai_id IS NOT NULL THEN
        INSERT INTO "FinancialRecords" (
            id, document_id, user_id, record_type, transaction_date, amount, 
            currency, description, category, payment_method, establishment,
            is_expense, is_recurring, created_at, updated_at
        ) VALUES (
            gen_random_uuid(), fatura_mai_id, user_id, 'fatura'::enum_FinancialRecords_record_type,
            '2025-05-15', 490.85, 'BRL', 'Supermercado', 'alimentacao', 'cartão de crédito', 'Supermercado Extra',
            true, false, '2025-05-15 10:00:00', '2025-05-15 10:00:00'
        );
    END IF;
    
    -- Inserir transações de conta de energia (despesas)
    IF fatura_jan_id IS NOT NULL THEN
        INSERT INTO "FinancialRecords" (
            id, document_id, user_id, record_type, transaction_date, amount, 
            currency, description, category, payment_method, establishment,
            is_expense, is_recurring, created_at, updated_at
        ) VALUES (
            gen_random_uuid(), fatura_jan_id, user_id, 'fatura'::enum_FinancialRecords_record_type,
            '2025-01-20', 180.00, 'BRL', 'Conta de Energia', 'utilidades', 'cartão de crédito', 'Companhia Elétrica',
            true, true, '2025-01-20 10:00:00', '2025-01-20 10:00:00'
        );
    END IF;
    
    IF fatura_fev_id IS NOT NULL THEN
        INSERT INTO "FinancialRecords" (
            id, document_id, user_id, record_type, transaction_date, amount, 
            currency, description, category, payment_method, establishment,
            is_expense, is_recurring, created_at, updated_at
        ) VALUES (
            gen_random_uuid(), fatura_fev_id, user_id, 'fatura'::enum_FinancialRecords_record_type,
            '2025-02-20', 185.50, 'BRL', 'Conta de Energia', 'utilidades', 'cartão de crédito', 'Companhia Elétrica',
            true, true, '2025-02-20 10:00:00', '2025-02-20 10:00:00'
        );
    END IF;
    
    IF fatura_mar_id IS NOT NULL THEN
        INSERT INTO "FinancialRecords" (
            id, document_id, user_id, record_type, transaction_date, amount, 
            currency, description, category, payment_method, establishment,
            is_expense, is_recurring, created_at, updated_at
        ) VALUES (
            gen_random_uuid(), fatura_mar_id, user_id, 'fatura'::enum_FinancialRecords_record_type,
            '2025-03-20', 190.75, 'BRL', 'Conta de Energia', 'utilidades', 'cartão de crédito', 'Companhia Elétrica',
            true, true, '2025-03-20 10:00:00', '2025-03-20 10:00:00'
        );
    END IF;
    
    IF fatura_abr_id IS NOT NULL THEN
        INSERT INTO "FinancialRecords" (
            id, document_id, user_id, record_type, transaction_date, amount, 
            currency, description, category, payment_method, establishment,
            is_expense, is_recurring, created_at, updated_at
        ) VALUES (
            gen_random_uuid(), fatura_abr_id, user_id, 'fatura'::enum_FinancialRecords_record_type,
            '2025-04-20', 195.30, 'BRL', 'Conta de Energia', 'utilidades', 'cartão de crédito', 'Companhia Elétrica',
            true, true, '2025-04-20 10:00:00', '2025-04-20 10:00:00'
        );
    END IF;
    
    IF fatura_mai_id IS NOT NULL THEN
        INSERT INTO "FinancialRecords" (
            id, document_id, user_id, record_type, transaction_date, amount, 
            currency, description, category, payment_method, establishment,
            is_expense, is_recurring, created_at, updated_at
        ) VALUES (
            gen_random_uuid(), fatura_mai_id, user_id, 'fatura'::enum_FinancialRecords_record_type,
            '2025-05-20', 187.65, 'BRL', 'Conta de Energia', 'utilidades', 'cartão de crédito', 'Companhia Elétrica',
            true, true, '2025-05-20 10:00:00', '2025-05-20 10:00:00'
        );
    END IF;
    
END $$;
