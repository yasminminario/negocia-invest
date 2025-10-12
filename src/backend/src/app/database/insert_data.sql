-- Script para população do banco de dados com dados de exemplo
-- IDs agora são SERIAL (int autoincrement), não UUID
-- Não insira valores para os campos id, eles serão gerados automaticamente

-- Inserindo 15 usuários
INSERT INTO usuarios (nome, email, cpf, saldo_cc, endereco, renda_mensal, senha, celular, wallet_adress, facial, criado_em) VALUES
('João Silva Santos', 'joao.silva@email.com', '123.456.789-01', 1200.00, 'Rua das Flores, 123 - São Paulo/SP', 5500.00, '$2b$12$u1ExampleHashxxxxxxxxxxxxxxxxxx', '(11) 99999-0001', '0x1a2b3c4d5e6f7890abcdef1234567890abcdef01', 0.95, NOW() - INTERVAL '30 days'),
('Maria Oliveira Costa', 'maria.oliveira@email.com', '234.567.890-12', 8000.00, 'Av. Paulista, 456 - São Paulo/SP', 8200.00, '$2b$12$u2ExampleHashxxxxxxxxxxxxxxxxxx', '(11) 99999-0002', '0x2b3c4d5e6f7890abcdef1234567890abcdef0102', 0.87, NOW() - INTERVAL '25 days'),
('Pedro Henrique Lima', 'pedro.lima@email.com', '345.678.901-23', 500.00, 'Rua Augusta, 789 - São Paulo/SP', 3200.00, '$2b$12$u3ExampleHashxxxxxxxxxxxxxxxxxx', '(11) 99999-0003', '0x3c4d5e6f7890abcdef1234567890abcdef010203', 0.78, NOW() - INTERVAL '20 days'),
('Ana Carolina Ferreira', 'ana.ferreira@email.com', '456.789.012-34', 15000.00, 'Rua Oscar Freire, 321 - São Paulo/SP', 12000.00, '$2b$12$u4ExampleHashxxxxxxxxxxxxxxxxxx', '(11) 99999-0004', '0x4d5e6f7890abcdef1234567890abcdef01020304', 0.92, NOW() - INTERVAL '18 days'),
('Carlos Roberto Souza', 'carlos.souza@email.com', '567.890.123-45', 20000.00, 'Av. Faria Lima, 654 - São Paulo/SP', 15000.00, '$2b$12$u5ExampleHashxxxxxxxxxxxxxxxxxx', '(11) 99999-0005', '0x5e6f7890abcdef1234567890abcdef0102030405', 0.89, NOW() - INTERVAL '15 days'),
('Juliana Mendes Alves', 'juliana.alves@email.com', '678.901.234-56', 3000.00, 'Rua Consolação, 987 - São Paulo/SP', 6800.00, '$2b$12$u6ExampleHashxxxxxxxxxxxxxxxxxx', '(11) 99999-0006', '0x6f7890abcdef1234567890abcdef010203040506', 0.84, NOW() - INTERVAL '12 days'),
('Rafael dos Santos', 'rafael.santos@email.com', '789.012.345-67', 2500.00, 'Av. Rebouças, 147 - São Paulo/SP', 4500.00, '$2b$12$u7ExampleHashxxxxxxxxxxxxxxxxxx', '(11) 99999-0007', '0x7890abcdef1234567890abcdef01020304050607', 0.76, NOW() - INTERVAL '10 days'),
('Fernanda Costa Silva', 'fernanda.silva@email.com', '890.123.456-78', 9000.00, 'Rua Haddock Lobo, 258 - São Paulo/SP', 9500.00, '$2b$12$u8ExampleHashxxxxxxxxxxxxxxxxxx', '(11) 99999-0008', '0x890abcdef1234567890abcdef0102030405060708', 0.91, NOW() - INTERVAL '8 days'),
('Lucas Pereira Rocha', 'lucas.rocha@email.com', '901.234.567-89', 7000.00, 'Rua Estados Unidos, 369 - São Paulo/SP', 7300.00, '$2b$12$u9ExampleHashxxxxxxxxxxxxxxxxxx', '(11) 99999-0009', '0x90abcdef1234567890abcdef010203040506070809', 0.82, NOW() - INTERVAL '6 days'),
('Mariana Barbosa Lima', 'mariana.lima@email.com', '012.345.678-90', 11000.00, 'Av. Europa, 741 - São Paulo/SP', 11200.00, '$2b$12$u10ExampleHashxxxxxxxxxxxxxxxxx', '(11) 99999-0010', '0xabcdef1234567890abcdef01020304050607080910', 0.88, NOW() - INTERVAL '5 days'),
('Bruno Cardoso Nunes', 'bruno.nunes@email.com', '123.456.789-00', 5000.00, 'Rua Bela Cintra, 852 - São Paulo/SP', 5900.00, '$2b$12$u11ExampleHashxxxxxxxxxxxxxxxxx', '(11) 99999-0011', '0xbcdef1234567890abcdef0102030405060708091011', 0.79, NOW() - INTERVAL '4 days'),
('Camila Rodrigues Gomes', 'camila.gomes@email.com', '234.567.890-11', 13000.00, 'Av. Nove de Julho, 963 - São Paulo/SP', 13500.00, '$2b$12$u12ExampleHashxxxxxxxxxxxxxxxxx', '(11) 99999-0012', '0xcdef1234567890abcdef010203040506070809101112', 0.93, NOW() - INTERVAL '3 days'),
('Diego Santos Martins', 'diego.martins@email.com', '345.678.901-22', 4000.00, 'Rua Alameda Santos, 159 - São Paulo/SP', 4200.00, '$2b$12$u13ExampleHashxxxxxxxxxxxxxxxxx', '(11) 99999-0013', '0xdef1234567890abcdef01020304050607080910111213', 0.73, NOW() - INTERVAL '2 days'),
('Gabriela Fernandes', 'gabriela.fernandes@email.com', '456.789.012-33', 8500.00, 'Rua Pamplona, 357 - São Paulo/SP', 8900.00, '$2b$12$u14ExampleHashxxxxxxxxxxxxxxxxx', '(11) 99999-0014', '0xef1234567890abcdef0102030405060708091011121314', 0.86, NOW() - INTERVAL '1 day'),
('Henrique Almeida Costa', 'henrique.costa@email.com', '567.890.123-44', 16000.00, 'Av. Ibirapuera, 468 - São Paulo/SP', 16800.00, '$2b$12$u15ExampleHashxxxxxxxxxxxxxxxxx', '(11) 99999-0015', '0xf1234567890abcdef010203040506070809101112131415', 0.94, NOW());

-- Os IDs dos usuários agora serão 1 a 15 (na ordem acima)

-- Inserindo scores de crédito (um para cada usuário)
INSERT INTO scores_credito (id_usuarios, valor_score, atualizado_em, analise, risco) VALUES
(1, 720, NOW() - INTERVAL '1 day', '{"tempo_na_plataforma_meses": 1, "emprestimos_contratados": 2, "emprestimos_quitados": 2, "emprestimos_inadimplentes": 0, "taxa_inadimplencia": 0.0, "media_taxa_juros_paga": 1.2, "media_prazo_contratado": 12, "renda_mensal": 5500.0, "endividamento_estimado": 0.2, "propostas_realizadas": 3, "propostas_aceitas": 1, "media_tempo_negociacao_dias": 5.0}', 0.3),
(2, 850, NOW() - INTERVAL '2 days', '{"tempo_na_plataforma_meses": 1, "emprestimos_contratados": 3, "emprestimos_quitados": 3, "emprestimos_inadimplentes": 0, "taxa_inadimplencia": 0.0, "media_taxa_juros_paga": 1.3, "media_prazo_contratado": 14, "renda_mensal": 8200.0, "endividamento_estimado": 0.1, "propostas_realizadas": 4, "propostas_aceitas": 2, "media_tempo_negociacao_dias": 4.0}', 0.1),
(3, 580, NOW() - INTERVAL '3 days', '{"tempo_na_plataforma_meses": 1, "emprestimos_contratados": 1, "emprestimos_quitados": 0, "emprestimos_inadimplentes": 1, "taxa_inadimplencia": 1.0, "media_taxa_juros_paga": 1.8, "media_prazo_contratado": 18, "renda_mensal": 3200.0, "endividamento_estimado": 0.5, "propostas_realizadas": 2, "propostas_aceitas": 0, "media_tempo_negociacao_dias": 7.0}', 0.6),
(4, 920, NOW() - INTERVAL '1 day', '{"tempo_na_plataforma_meses": 1, "emprestimos_contratados": 4, "emprestimos_quitados": 4, "emprestimos_inadimplentes": 0, "taxa_inadimplencia": 0.0, "media_taxa_juros_paga": 1.5, "media_prazo_contratado": 16, "renda_mensal": 12000.0, "endividamento_estimado": 0.05, "propostas_realizadas": 5, "propostas_aceitas": 3, "media_tempo_negociacao_dias": 3.0}', 0.05),
(5, 890, NOW() - INTERVAL '2 days', '{"tempo_na_plataforma_meses": 1, "emprestimos_contratados": 2, "emprestimos_quitados": 2, "emprestimos_inadimplentes": 0, "taxa_inadimplencia": 0.0, "media_taxa_juros_paga": 1.7, "media_prazo_contratado": 15, "renda_mensal": 15000.0, "endividamento_estimado": 0.1, "propostas_realizadas": 3, "propostas_aceitas": 2, "media_tempo_negociacao_dias": 6.0}', 0.15),
(6, 680, NOW() - INTERVAL '4 days', '{"tempo_na_plataforma_meses": 1, "emprestimos_contratados": 1, "emprestimos_quitados": 1, "emprestimos_inadimplentes": 0, "taxa_inadimplencia": 0.0, "media_taxa_juros_paga": 2.1, "media_prazo_contratado": 24, "renda_mensal": 6800.0, "endividamento_estimado": 0.3, "propostas_realizadas": 2, "propostas_aceitas": 1, "media_tempo_negociacao_dias": 8.0}', 0.4),
(7, 620, NOW() - INTERVAL '5 days', '{"tempo_na_plataforma_meses": 1, "emprestimos_contratados": 1, "emprestimos_quitados": 0, "emprestimos_inadimplentes": 1, "taxa_inadimplencia": 1.0, "media_taxa_juros_paga": 1.5, "media_prazo_contratado": 12, "renda_mensal": 4500.0, "endividamento_estimado": 0.6, "propostas_realizadas": 1, "propostas_aceitas": 0, "media_tempo_negociacao_dias": 9.0}', 0.55),
(8, 780, NOW() - INTERVAL '1 day', '{"tempo_na_plataforma_meses": 1, "emprestimos_contratados": 2, "emprestimos_quitados": 2, "emprestimos_inadimplentes": 0, "taxa_inadimplencia": 0.0, "media_taxa_juros_paga": 1.6, "media_prazo_contratado": 14, "renda_mensal": 9500.0, "endividamento_estimado": 0.18, "propostas_realizadas": 2, "propostas_aceitas": 1, "media_tempo_negociacao_dias": 4.0}', 0.25),
(9, 710, NOW() - INTERVAL '3 days', '{"tempo_na_plataforma_meses": 1, "emprestimos_contratados": 2, "emprestimos_quitados": 1, "emprestimos_inadimplentes": 1, "taxa_inadimplencia": 0.5, "media_taxa_juros_paga": 1.8, "media_prazo_contratado": 16, "renda_mensal": 7300.0, "endividamento_estimado": 0.22, "propostas_realizadas": 2, "propostas_aceitas": 1, "media_tempo_negociacao_dias": 5.0}', 0.35),
(10, 840, NOW() - INTERVAL '2 days', '{"tempo_na_plataforma_meses": 1, "emprestimos_contratados": 3, "emprestimos_quitados": 3, "emprestimos_inadimplentes": 0, "taxa_inadimplencia": 0.0, "media_taxa_juros_paga": 1.9, "media_prazo_contratado": 18, "renda_mensal": 11200.0, "endividamento_estimado": 0.09, "propostas_realizadas": 3, "propostas_aceitas": 2, "media_tempo_negociacao_dias": 3.0}', 0.12),
(11, 650, NOW() - INTERVAL '6 days', '{"tempo_na_plataforma_meses": 1, "emprestimos_contratados": 1, "emprestimos_quitados": 1, "emprestimos_inadimplentes": 0, "taxa_inadimplencia": 0.0, "media_taxa_juros_paga": 2.3, "media_prazo_contratado": 30, "renda_mensal": 5900.0, "endividamento_estimado": 0.32, "propostas_realizadas": 2, "propostas_aceitas": 1, "media_tempo_negociacao_dias": 7.0}', 0.45),
(12, 900, NOW() - INTERVAL '1 day', '{"tempo_na_plataforma_meses": 1, "emprestimos_contratados": 4, "emprestimos_quitados": 4, "emprestimos_inadimplentes": 0, "taxa_inadimplencia": 0.0, "media_taxa_juros_paga": 2.3, "media_prazo_contratado": 30, "renda_mensal": 13500.0, "endividamento_estimado": 0.07, "propostas_realizadas": 4, "propostas_aceitas": 3, "media_tempo_negociacao_dias": 2.0}', 0.08),
(13, 540, NOW() - INTERVAL '7 days', '{"tempo_na_plataforma_meses": 1, "emprestimos_contratados": 0, "emprestimos_quitados": 0, "emprestimos_inadimplentes": 0, "taxa_inadimplencia": 0.0, "media_taxa_juros_paga": 0.0, "media_prazo_contratado": 0, "renda_mensal": 4200.0, "endividamento_estimado": 0.0, "propostas_realizadas": 0, "propostas_aceitas": 0, "media_tempo_negociacao_dias": 0.0}', 0.75),
(14, 760, NOW() - INTERVAL '2 days', '{"tempo_na_plataforma_meses": 1, "emprestimos_contratados": 2, "emprestimos_quitados": 2, "emprestimos_inadimplentes": 0, "taxa_inadimplencia": 0.0, "media_taxa_juros_paga": 1.6, "media_prazo_contratado": 14, "renda_mensal": 8900.0, "endividamento_estimado": 0.19, "propostas_realizadas": 2, "propostas_aceitas": 1, "media_tempo_negociacao_dias": 3.0}', 0.28),
(15, 950, NOW() - INTERVAL '1 day', '{"tempo_na_plataforma_meses": 1, "emprestimos_contratados": 5, "emprestimos_quitados": 5, "emprestimos_inadimplentes": 0, "taxa_inadimplencia": 0.0, "media_taxa_juros_paga": 2.5, "media_prazo_contratado": 36, "renda_mensal": 16800.0, "endividamento_estimado": 0.03, "propostas_realizadas": 5, "propostas_aceitas": 4, "media_tempo_negociacao_dias": 1.0}', 0.02);

-- Inserindo métricas de investidores (para usuários com perfil de investidor)
INSERT INTO metricas_investidor (id_usuarios, valor_total_investido, rentabilidade_media_am, patrimonio, risco_medio, analise_taxa, atualizado_em) VALUES
(1, 180000.00, 1.6, 650000.00, 0.35, '{"taxa_preferida": "1.1-1.9", "perfil": "moderado"}', NOW()),
(2, 150000.00, 1.2, 500000.00, 0.3, '{"taxa_preferida": "0.8-1.5", "perfil": "conservador"}', NOW()),
(4, 300000.00, 1.8, 800000.00, 0.5, '{"taxa_preferida": "1.2-2.0", "perfil": "moderado"}', NOW()),
(5, 450000.00, 2.1, 1200000.00, 0.6, '{"taxa_preferida": "1.5-2.5", "perfil": "arrojado"}', NOW()),
(8, 200000.00, 1.5, 600000.00, 0.4, '{"taxa_preferida": "1.0-1.8", "perfil": "conservador"}', NOW()),
(10, 350000.00, 1.9, 900000.00, 0.5, '{"taxa_preferida": "1.3-2.2", "perfil": "moderado"}', NOW()),
(12, 500000.00, 2.3, 1500000.00, 0.7, '{"taxa_preferida": "1.8-3.0", "perfil": "arrojado"}', NOW()),
(15, 600000.00, 2.5, 2000000.00, 0.8, '{"taxa_preferida": "2.0-3.5", "perfil": "arrojado"}', NOW());

-- Inserindo negociações
INSERT INTO negociacoes (
    id_tomador, id_investidor, status, criado_em, atualizado_em, taxa, quant_propostas, prazo, valor, parcela, hash_onchain, contrato_tx_hash, assinado_em
) VALUES
(1, 2, 'finalizada', NOW() - INTERVAL '10 days', NOW() - INTERVAL '2 days', 1.2, 3, 12, 10000.00, 860.00, '0xabc123def456', '0x789ghi012jkl', NOW() - INTERVAL '2 days'),
(3, 4, 'em_andamento', NOW() - INTERVAL '5 days', NOW() - INTERVAL '1 day', 1.8, 2, 18, 18000.00, 1150.00, NULL, NULL, NULL),
(6, 5, 'finalizada', NOW() - INTERVAL '15 days', NOW() - INTERVAL '5 days', 2.1, 4, 24, 25000.00, 1290.00, '0xdef456ghi789', '0x012jkl345mno', NOW() - INTERVAL '5 days'),
(7, 8, 'em_negociacao', NOW() - INTERVAL '3 days', NOW(), 1.5, 1, 15, 12000.00, 950.00, NULL, NULL, NULL),
(9, 10, 'cancelada', NOW() - INTERVAL '8 days', NOW() - INTERVAL '3 days', NULL, 2, 20, 20000.00, 1220.00, NULL, NULL, NULL),
(11, 12, 'em_andamento', NOW() - INTERVAL '2 days', NOW(), 2.3, 2, 30, 30000.00, 1150.00, NULL, NULL, NULL),
(13, 15, 'pendente', NOW() - INTERVAL '1 day', NOW(), 2.8, 1, 36, 25000.00, 800.00, NULL, NULL, NULL),
(14, 4, 'em_negociacao', NOW(), NOW(), 1.6, 1, 14, 14000.00, 1050.00, NULL, NULL, NULL);

-- Os IDs das negociações agora serão 1 a 8 (na ordem acima)

-- Inserindo propostas para as negociações
INSERT INTO propostas (id_negociacoes, id_autor, autor_tipo, taxa_analisada, taxa_sugerida, prazo_meses, criado_em, tipo, status, parcela, valor, justificativa, negociavel) VALUES
-- Propostas para negociação 1 (finalizada)
(1, 1, 'tomador', '1.5-2.0', '1.0-3.0', 12, NOW() - INTERVAL '10 days', 'inicial', 'rejeitada', 850.00, 10000.00, 'Preciso de taxa mais baixa', true),
(1, 2, 'investidor', '1.0-1.8', '1.3-2.0', 12, NOW() - INTERVAL '9 days', 'contraproposta', 'rejeitada', 870.00, 10000.00, 'Taxa muito baixa para o risco', true),
(1, 1, 'tomador', '1.3-1.8', '1.2-2.0', 12, NOW() - INTERVAL '8 days', 'contraproposta', 'aceita', 860.00, 10000.00, 'Aceito essa taxa', false),

-- Propostas para negociação 2 (em andamento)
(2, 3, 'tomador', '2.0-2.5', '1.5-2.0', 18, NOW() - INTERVAL '5 days', 'inicial', 'pendente', 1100.00, 18000.00, 'Primeira casa própria', true),
(2, 4, 'investidor', '1.5-2.0', '1.8-2.5', 18, NOW() - INTERVAL '4 days', 'contraproposta', 'em_analise', 1150.00, 18000.00, 'Ajuste necessário por risco', true),

-- Propostas para negociação 3 (finalizada)
(3, 6, 'tomador', '2.5-3.0', '1.8-2.5', 24, NOW() - INTERVAL '15 days', 'inicial', 'rejeitada', 1250.00, 25000.00, 'Capital de giro', true),
(3, 5, 'investidor', '1.8-2.2', '2.2-2.8', 24, NOW() - INTERVAL '14 days', 'contraproposta', 'rejeitada', 1300.00, 25000.00, 'Risco elevado requer ajuste', true),
(3, 6, 'tomador', '2.2-2.8', '2.0-2.5', 24, NOW() - INTERVAL '13 days', 'contraproposta', 'rejeitada', 1280.00, 25000.00, 'Consigo pagar um pouco mais', true),
(3, 5, 'investidor', '2.0-2.1', '2.1-2.2', 24, NOW() - INTERVAL '12 days', 'final', 'aceita', 1290.00, 25000.00, 'Acordo fechado', false),

(4, 7, 'tomador', '1.8-1.9', '1.3-1.4', 15, NOW() - INTERVAL '3 days', 'inicial', 'em_analise', 950.00, 12000.00, 'Reforma residencial', true),

-- Propostas de investidores disponíveis no mercado (sem negociação vinculada)
INSERT INTO propostas (id_negociacoes, id_autor, autor_tipo, taxa_analisada, taxa_sugerida, prazo_meses, criado_em, tipo, status, parcela, valor, justificativa, negociavel) VALUES
(NULL, 2, 'investidor', '0.8-1.5', '0.9-1.3', 18, NOW() - INTERVAL '6 hours', 'inicial', 'pendente', 750.00, 12000.00, 'Oferta com condições diferenciadas para tomadores com bom histórico.', true),
(NULL, 5, 'investidor', '1.4-2.2', '1.6-2.1', 24, NOW() - INTERVAL '12 hours', 'inicial', 'pendente', 980.00, 18000.00, 'Preferência por tomadores de perfil moderado.', true),
(NULL, 8, 'investidor', '1.2-1.8', '1.1-1.6', 36, NOW() - INTERVAL '1 day', 'inicial', 'pendente', 620.00, 20000.00, 'Oferta com taxa ajustável conforme perfil de risco.', true),
(NULL, 12, 'investidor', '1.8-2.8', '2.0-2.6', 48, NOW() - INTERVAL '2 days', 'inicial', 'pendente', 630.00, 25000.00, 'Disponível para negociações rápidas via plataforma.', true);

-- Solicitações de tomadores disponíveis no mercado (sem negociação vinculada)
INSERT INTO propostas (id_negociacoes, id_autor, autor_tipo, taxa_analisada, taxa_sugerida, prazo_meses, criado_em, tipo, status, parcela, valor, justificativa, negociavel) VALUES
(NULL, 3, 'tomador', '1.1-1.9', '1.0-1.5', 24, NOW() - INTERVAL '5 hours', 'inicial', 'pendente', 540.00, 10000.00, 'Capital de giro para pequeno negócio.', true),
(NULL, 6, 'tomador', '1.6-2.4', '1.4-2.0', 18, NOW() - INTERVAL '1 day', 'inicial', 'pendente', 680.00, 15000.00, 'Expansão de equipe e marketing.', true),
(NULL, 9, 'tomador', '1.5-2.3', '1.3-1.9', 30, NOW() - INTERVAL '2 days', 'inicial', 'pendente', 720.00, 22000.00, 'Reformas e modernização do escritório.', true),
(NULL, 11, 'tomador', '1.9-2.6', '1.8-2.3', 36, NOW() - INTERVAL '3 days', 'inicial', 'pendente', 890.00, 26000.00, 'Investimento em tecnologia e automação.', true);

-- Propostas para negociação 5 (cancelada)
(5, 9, 'tomador', '2.2-2.5', '1.8-2.0', 20, NOW() - INTERVAL '8 days', 'inicial', 'cancelada', 1200.00, 20000.00, 'Mudança de planos', true),
(5, 10, 'investidor', '1.8-2.0', '2.0-2.2', 20, NOW() - INTERVAL '7 days', 'contraproposta', 'cancelada', 1220.00, 20000.00, 'Dentro do perfil', true),

-- Propostas para negociação 6 (em andamento)
(6, 11, 'tomador', '2.5-3.0', '2.0-2.5', 30, NOW() - INTERVAL '2 days', 'inicial', 'pendente', 1100.00, 30000.00, 'Expansão negócio', true),
(6, 12, 'investidor', '2.0-2.3', '2.3-2.5', 30, NOW() - INTERVAL '1 day', 'contraproposta', 'em_analise', 1150.00, 30000.00, 'Perfil de risco adequado', true),

-- Propostas para negociação 7 (pendente)
(7, 13, 'tomador', '3.0-3.5', '2.5-3.0', 36, NOW() - INTERVAL '1 day', 'inicial', 'pendente', 800.00, 25000.00, 'Necessidade urgente', true),

-- Propostas para negociação 8 (em negociação)
(8, 14, 'tomador', '1.8-1.9', '1.4-1.5', 14, NOW(), 'inicial', 'em_analise', 1050.00, 14000.00, 'Investimento pessoal', true);

-- Comentários informativos
-- Total de registros inseridos:
-- - 15 usuários
-- - 15 scores de crédito (1 para cada usuário)
-- - 8 métricas de investidor (usuários com perfil investidor)
-- - 8 negociações (com diferentes status)
-- - 16 propostas (distribuídas entre as negociações)