-- Script para população do banco de dados com dados de exemplo
-- Insere 15 usuários e dados relacionados respeitando as constraints

-- Inserindo 15 usuários
INSERT INTO usuarios (id, nome, email, cpf, endereco, renda_mensal, celular, wallet_adress, facial, criado_em) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'João Silva Santos', 'joao.silva@email.com', '123.456.789-01', 'Rua das Flores, 123 - São Paulo/SP', 5500.00, '(11) 99999-0001', '0x1a2b3c4d5e6f7890abcdef1234567890abcdef01', 0.95, NOW() - INTERVAL '30 days'),
('550e8400-e29b-41d4-a716-446655440002', 'Maria Oliveira Costa', 'maria.oliveira@email.com', '234.567.890-12', 'Av. Paulista, 456 - São Paulo/SP', 8200.00, '(11) 99999-0002', '0x2b3c4d5e6f7890abcdef1234567890abcdef0102', 0.87, NOW() - INTERVAL '25 days'),
('550e8400-e29b-41d4-a716-446655440003', 'Pedro Henrique Lima', 'pedro.lima@email.com', '345.678.901-23', 'Rua Augusta, 789 - São Paulo/SP', 3200.00, '(11) 99999-0003', '0x3c4d5e6f7890abcdef1234567890abcdef010203', 0.78, NOW() - INTERVAL '20 days'),
('550e8400-e29b-41d4-a716-446655440004', 'Ana Carolina Ferreira', 'ana.ferreira@email.com', '456.789.012-34', 'Rua Oscar Freire, 321 - São Paulo/SP', 12000.00, '(11) 99999-0004', '0x4d5e6f7890abcdef1234567890abcdef01020304', 0.92, NOW() - INTERVAL '18 days'),
('550e8400-e29b-41d4-a716-446655440005', 'Carlos Roberto Souza', 'carlos.souza@email.com', '567.890.123-45', 'Av. Faria Lima, 654 - São Paulo/SP', 15000.00, '(11) 99999-0005', '0x5e6f7890abcdef1234567890abcdef0102030405', 0.89, NOW() - INTERVAL '15 days'),
('550e8400-e29b-41d4-a716-446655440006', 'Juliana Mendes Alves', 'juliana.alves@email.com', '678.901.234-56', 'Rua Consolação, 987 - São Paulo/SP', 6800.00, '(11) 99999-0006', '0x6f7890abcdef1234567890abcdef010203040506', 0.84, NOW() - INTERVAL '12 days'),
('550e8400-e29b-41d4-a716-446655440007', 'Rafael dos Santos', 'rafael.santos@email.com', '789.012.345-67', 'Av. Rebouças, 147 - São Paulo/SP', 4500.00, '(11) 99999-0007', '0x7890abcdef1234567890abcdef01020304050607', 0.76, NOW() - INTERVAL '10 days'),
('550e8400-e29b-41d4-a716-446655440008', 'Fernanda Costa Silva', 'fernanda.silva@email.com', '890.123.456-78', 'Rua Haddock Lobo, 258 - São Paulo/SP', 9500.00, '(11) 99999-0008', '0x890abcdef1234567890abcdef0102030405060708', 0.91, NOW() - INTERVAL '8 days'),
('550e8400-e29b-41d4-a716-446655440009', 'Lucas Pereira Rocha', 'lucas.rocha@email.com', '901.234.567-89', 'Rua Estados Unidos, 369 - São Paulo/SP', 7300.00, '(11) 99999-0009', '0x90abcdef1234567890abcdef010203040506070809', 0.82, NOW() - INTERVAL '6 days'),
('550e8400-e29b-41d4-a716-446655440010', 'Mariana Barbosa Lima', 'mariana.lima@email.com', '012.345.678-90', 'Av. Europa, 741 - São Paulo/SP', 11200.00, '(11) 99999-0010', '0xabcdef1234567890abcdef01020304050607080910', 0.88, NOW() - INTERVAL '5 days'),
('550e8400-e29b-41d4-a716-446655440011', 'Bruno Cardoso Nunes', 'bruno.nunes@email.com', '123.456.789-00', 'Rua Bela Cintra, 852 - São Paulo/SP', 5900.00, '(11) 99999-0011', '0xbcdef1234567890abcdef0102030405060708091011', 0.79, NOW() - INTERVAL '4 days'),
('550e8400-e29b-41d4-a716-446655440012', 'Camila Rodrigues Gomes', 'camila.gomes@email.com', '234.567.890-11', 'Av. Nove de Julho, 963 - São Paulo/SP', 13500.00, '(11) 99999-0012', '0xcdef1234567890abcdef010203040506070809101112', 0.93, NOW() - INTERVAL '3 days'),
('550e8400-e29b-41d4-a716-446655440013', 'Diego Santos Martins', 'diego.martins@email.com', '345.678.901-22', 'Rua Alameda Santos, 159 - São Paulo/SP', 4200.00, '(11) 99999-0013', '0xdef1234567890abcdef01020304050607080910111213', 0.73, NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440014', 'Gabriela Fernandes', 'gabriela.fernandes@email.com', '456.789.012-33', 'Rua Pamplona, 357 - São Paulo/SP', 8900.00, '(11) 99999-0014', '0xef1234567890abcdef0102030405060708091011121314', 0.86, NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440015', 'Henrique Almeida Costa', 'henrique.costa@email.com', '567.890.123-44', 'Av. Ibirapuera, 468 - São Paulo/SP', 16800.00, '(11) 99999-0015', '0xf1234567890abcdef010203040506070809101112131415', 0.94, NOW());

-- Inserindo scores de crédito (um para cada usuário)
INSERT INTO scores_credito (id, id_usuarios, valor_score, atualizado_em, analise, risco) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 720, NOW() - INTERVAL '1 day', '{"historico_pagamento": "bom", "dividas_ativas": "baixas", "renda_compativel": true}', 0.3),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 850, NOW() - INTERVAL '2 days', '{"historico_pagamento": "excelente", "dividas_ativas": "nenhuma", "renda_compativel": true}', 0.1),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 580, NOW() - INTERVAL '3 days', '{"historico_pagamento": "regular", "dividas_ativas": "medias", "renda_compativel": true}', 0.6),
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 920, NOW() - INTERVAL '1 day', '{"historico_pagamento": "excelente", "dividas_ativas": "nenhuma", "renda_compativel": true}', 0.05),
('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 890, NOW() - INTERVAL '2 days', '{"historico_pagamento": "muito_bom", "dividas_ativas": "baixas", "renda_compativel": true}', 0.15),
('660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440006', 680, NOW() - INTERVAL '4 days', '{"historico_pagamento": "bom", "dividas_ativas": "medias", "renda_compativel": true}', 0.4),
('660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440007', 620, NOW() - INTERVAL '5 days', '{"historico_pagamento": "regular", "dividas_ativas": "medias", "renda_compativel": false}', 0.55),
('660e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440008', 780, NOW() - INTERVAL '1 day', '{"historico_pagamento": "bom", "dividas_ativas": "baixas", "renda_compativel": true}', 0.25),
('660e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440009', 710, NOW() - INTERVAL '3 days', '{"historico_pagamento": "bom", "dividas_ativas": "baixas", "renda_compativel": true}', 0.35),
('660e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440010', 840, NOW() - INTERVAL '2 days', '{"historico_pagamento": "muito_bom", "dividas_ativas": "nenhuma", "renda_compativel": true}', 0.12),
('660e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440011', 650, NOW() - INTERVAL '6 days', '{"historico_pagamento": "regular", "dividas_ativas": "medias", "renda_compativel": true}', 0.45),
('660e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440012', 900, NOW() - INTERVAL '1 day', '{"historico_pagamento": "excelente", "dividas_ativas": "nenhuma", "renda_compativel": true}', 0.08),
('660e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440013', 540, NOW() - INTERVAL '7 days', '{"historico_pagamento": "ruim", "dividas_ativas": "altas", "renda_compativel": false}', 0.75),
('660e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440014', 760, NOW() - INTERVAL '2 days', '{"historico_pagamento": "bom", "dividas_ativas": "baixas", "renda_compativel": true}', 0.28),
('660e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440015', 950, NOW() - INTERVAL '1 day', '{"historico_pagamento": "excelente", "dividas_ativas": "nenhuma", "renda_compativel": true}', 0.02);

-- Inserindo métricas de investidores (para usuários com perfil de investidor)
INSERT INTO metricas_investidor (id, id_usuarios, valor_total_investido, rentabilidade_media_am, patrimonio, risco_medio, analise_taxa, atualizado_em) VALUES
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 150000.00, 1.2, 500000.00, 0.3, '{"taxa_preferida": "0.8-1.5", "perfil": "conservador"}', NOW()),
('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 300000.00, 1.8, 800000.00, 0.5, '{"taxa_preferida": "1.2-2.0", "perfil": "moderado"}', NOW()),
('770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 450000.00, 2.1, 1200000.00, 0.6, '{"taxa_preferida": "1.5-2.5", "perfil": "arrojado"}', NOW()),
('770e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440008', 200000.00, 1.5, 600000.00, 0.4, '{"taxa_preferida": "1.0-1.8", "perfil": "conservador"}', NOW()),
('770e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440010', 350000.00, 1.9, 900000.00, 0.5, '{"taxa_preferida": "1.3-2.2", "perfil": "moderado"}', NOW()),
('770e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440012', 500000.00, 2.3, 1500000.00, 0.7, '{"taxa_preferida": "1.8-3.0", "perfil": "arrojado"}', NOW()),
('770e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440015', 600000.00, 2.5, 2000000.00, 0.8, '{"taxa_preferida": "2.0-3.5", "perfil": "arrojado"}', NOW());

-- Inserindo negociações
INSERT INTO negociacoes (id, id_tomador, id_investidor, status, criado_em, atualizado_em, taxa, quant_propostas, hash_onchain, contrato_tx_hash, assinado_em) VALUES
('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'finalizada', NOW() - INTERVAL '10 days', NOW() - INTERVAL '2 days', 1.2, 3, '0xabc123def456', '0x789ghi012jkl', NOW() - INTERVAL '2 days'),
('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', 'em_andamento', NOW() - INTERVAL '5 days', NOW() - INTERVAL '1 day', 1.8, 2, NULL, NULL, NULL),
('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440005', 'finalizada', NOW() - INTERVAL '15 days', NOW() - INTERVAL '5 days', 2.1, 4, '0xdef456ghi789', '0x012jkl345mno', NOW() - INTERVAL '5 days'),
('880e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440008', 'em_negociacao', NOW() - INTERVAL '3 days', NOW(), 1.5, 1, NULL, NULL, NULL),
('880e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440010', 'cancelada', NOW() - INTERVAL '8 days', NOW() - INTERVAL '3 days', 0, 2, NULL, NULL, NULL),
('880e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440012', 'em_andamento', NOW() - INTERVAL '2 days', NOW(), 2.3, 2, NULL, NULL, NULL),
('880e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440015', 'pendente', NOW() - INTERVAL '1 day', NOW(), 2.8, 1, NULL, NULL, NULL),
('880e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440004', 'em_negociacao', NOW(), NOW(), 1.6, 1, NULL, NULL, NULL);

-- Inserindo propostas para as negociações
INSERT INTO propostas (id, id_negociacoes, id_autor, autor_tipo, taxa_analisada, taxa_sugerida, prazo_meses, criado_em, tipo, status, parcela, valor, justificativa, negociavel) VALUES
-- Propostas para negociação 1 (finalizada)
('990e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'tomador', '1.5%', '1.0%', 12, NOW() - INTERVAL '10 days', 'inicial', 'rejeitada', 850.00, 10000.00, 'Preciso de taxa mais baixa', true),
('990e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'investidor', '1.0%', '1.3%', 12, NOW() - INTERVAL '9 days', 'contraproposta', 'rejeitada', 870.00, 10000.00, 'Taxa muito baixa para o risco', true),
('990e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'tomador', '1.3%', '1.2%', 12, NOW() - INTERVAL '8 days', 'contraproposta', 'aceita', 860.00, 10000.00, 'Aceito essa taxa', false),

-- Propostas para negociação 2 (em andamento)
('990e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'tomador', '2.0%', '1.5%', 18, NOW() - INTERVAL '5 days', 'inicial', 'pendente', 1100.00, 18000.00, 'Primeira casa própria', true),
('990e8400-e29b-41d4-a716-446655440005', '880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', 'investidor', '1.5%', '1.8%', 18, NOW() - INTERVAL '4 days', 'contraproposta', 'em_analise', 1150.00, 18000.00, 'Ajuste necessário por risco', true),

-- Propostas para negociação 3 (finalizada)
('990e8400-e29b-41d4-a716-446655440006', '880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440006', 'tomador', '2.5%', '1.8%', 24, NOW() - INTERVAL '15 days', 'inicial', 'rejeitada', 1250.00, 25000.00, 'Capital de giro', true),
('990e8400-e29b-41d4-a716-446655440007', '880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005', 'investidor', '1.8%', '2.2%', 24, NOW() - INTERVAL '14 days', 'contraproposta', 'rejeitada', 1300.00, 25000.00, 'Risco elevado requer ajuste', true),
('990e8400-e29b-41d4-a716-446655440008', '880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440006', 'tomador', '2.2%', '2.0%', 24, NOW() - INTERVAL '13 days', 'contraproposta', 'rejeitada', 1280.00, 25000.00, 'Consigo pagar um pouco mais', true),
('990e8400-e29b-41d4-a716-446655440009', '880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005', 'investidor', '2.0%', '2.1%', 24, NOW() - INTERVAL '12 days', 'final', 'aceita', 1290.00, 25000.00, 'Acordo fechado', false),

-- Propostas para negociação 4 (em negociação)
('990e8400-e29b-41d4-a716-446655440010', '880e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440007', 'tomador', '1.8%', '1.3%', 15, NOW() - INTERVAL '3 days', 'inicial', 'em_analise', 950.00, 12000.00, 'Reforma residencial', true),

-- Propostas para negociação 5 (cancelada)
('990e8400-e29b-41d4-a716-446655440011', '880e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440009', 'tomador', '2.2%', '1.8%', 20, NOW() - INTERVAL '8 days', 'inicial', 'cancelada', 1200.00, 20000.00, 'Mudança de planos', true),
('990e8400-e29b-41d4-a716-446655440012', '880e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440010', 'investidor', '1.8%', '2.0%', 20, NOW() - INTERVAL '7 days', 'contraproposta', 'cancelada', 1220.00, 20000.00, 'Dentro do perfil', true),

-- Propostas para negociação 6 (em andamento)
('990e8400-e29b-41d4-a716-446655440013', '880e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440011', 'tomador', '2.5%', '2.0%', 30, NOW() - INTERVAL '2 days', 'inicial', 'pendente', 1100.00, 30000.00, 'Expansão negócio', true),
('990e8400-e29b-41d4-a716-446655440014', '880e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440012', 'investidor', '2.0%', '2.3%', 30, NOW() - INTERVAL '1 day', 'contraproposta', 'em_analise', 1150.00, 30000.00, 'Perfil de risco adequado', true),

-- Propostas para negociação 7 (pendente)
('990e8400-e29b-41d4-a716-446655440015', '880e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440013', 'tomador', '3.0%', '2.5%', 36, NOW() - INTERVAL '1 day', 'inicial', 'pendente', 800.00, 25000.00, 'Necessidade urgente', true),

-- Propostas para negociação 8 (em negociação)
('990e8400-e29b-41d4-a716-446655440016', '880e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440014', 'tomador', '1.8%', '1.4%', 14, NOW(), 'inicial', 'em_analise', 1050.00, 14000.00, 'Investimento pessoal', true);

-- Comentários informativos
-- Total de registros inseridos:
-- - 15 usuários
-- - 15 scores de crédito (1 para cada usuário)
-- - 7 métricas de investidor (usuários com perfil investidor)
-- - 8 negociações (com diferentes status)
-- - 16 propostas (distribuídas entre as negociações)