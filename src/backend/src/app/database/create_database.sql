-- Cria o banco de dados local e suas tabelas no PostgreSQL para armazenar e gerenciar dados da aplicação.

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome varchar(160) NOT NULL,
    email varchar(160) NOT NULL UNIQUE,
    cpf varchar(20) NOT NULL,
    saldo_cc numeric NOT NULL DEFAULT 0,
    endereco varchar(255),
    renda_mensal numeric,
    celular varchar(40) NOT NULL,
    wallet_adress varchar NOT NULL UNIQUE,
    facial numeric NOT NULL,
    criado_em timestamp NOT NULL DEFAULT now()
);

CREATE TABLE scores_credito (
    id SERIAL PRIMARY KEY,
    id_usuarios INT NOT NULL UNIQUE,
    valor_score numeric NOT NULL,
    atualizado_em timestamp NOT NULL,
    analise jsonb,
    risco numeric,
    CONSTRAINT fk_scores_usuario
        FOREIGN KEY (id_usuarios)
        REFERENCES usuarios(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE INDEX ix_scores_usuario_data ON scores_credito (id, atualizado_em);

CREATE TABLE negociacoes (
    id SERIAL PRIMARY KEY,
    id_tomador INT NOT NULL,
    id_investidor INT NOT NULL,
    status varchar(20) NOT NULL,
    criado_em timestamp NOT NULL DEFAULT now(),
    atualizado_em timestamp NOT NULL DEFAULT now(),
    taxa numeric,
    quant_propostas int,
    prazo numeric,
    valor numeric,
    parcela numeric,
    hash_onchain varchar,
    contrato_tx_hash varchar,
    assinado_em timestamp,
    CONSTRAINT fk_neg_tomador
        FOREIGN KEY (id_tomador)
        REFERENCES usuarios(id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fk_neg_investidor
        FOREIGN KEY (id_investidor)
        REFERENCES usuarios(id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE INDEX ix_neg_tomador_status ON negociacoes (id_tomador, status);

CREATE TABLE metricas_investidor (
    id SERIAL PRIMARY KEY,
    id_usuarios INT NOT NULL,
    valor_total_investido numeric NOT NULL DEFAULT 0,
    rentabilidade_media_am numeric NOT NULL DEFAULT 0,
    patrimonio numeric NOT NULL DEFAULT 0,
    risco_medio numeric,
    analise_taxa jsonb,
    atualizado_em timestamp NOT NULL DEFAULT now(),
    CONSTRAINT fk_metricas_usuario
        FOREIGN KEY (id_usuarios)
        REFERENCES usuarios(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE INDEX ix_prop_usuarios ON metricas_investidor (id_usuarios);

CREATE TABLE propostas (
    id SERIAL PRIMARY KEY,
    id_negociacoes INT,
    id_autor INT NOT NULL,
    autor_tipo varchar(12) NOT NULL,
    taxa_analisada varchar NOT NULL,
    taxa_sugerida varchar NOT NULL,
    prazo_meses int NOT NULL,
    criado_em timestamp NOT NULL DEFAULT now(),
    tipo varchar(50),
    status varchar(50) NOT NULL,
    parcela numeric,
    valor numeric,
    justificativa varchar(255),
    negociavel boolean NOT NULL,
    CONSTRAINT fk_prop_negociacoes
        FOREIGN KEY (id_negociacoes)
        REFERENCES negociacoes(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_prop_autor
        FOREIGN KEY (id_autor)
        REFERENCES usuarios(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE INDEX ix_prop_neg_data ON propostas (id_negociacoes, criado_em);
CREATE INDEX ix_prop_autor ON propostas (id_autor);

CREATE TABLE emprestimos (
    id SERIAL PRIMARY KEY,
    id_negociacoes INT NOT NULL,
    id_tomador INT NOT NULL,
    id_investidor INT NOT NULL,
    valor numeric NOT NULL,
    taxa numeric NOT NULL,
    prazo int NOT NULL,
    parcela numeric NOT NULL,
    contrato_tx_hash varchar NOT NULL,
    hash_onchain varchar NOT NULL,
    antecipacao_onchain varchar,
    contrato_antecipacao_hash varchar,
    status varchar(20) NOT NULL DEFAULT 'ativo',
    liquidado boolean NOT NULL DEFAULT false,
    criado_em timestamp NOT NULL DEFAULT now(),
    atualizado_em timestamp NOT NULL DEFAULT now(),
    liquidado_em timestamp,

    CONSTRAINT fk_emprest_negociacao
        FOREIGN KEY (id_negociacoes)
        REFERENCES negociacoes(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    -- id_tomador / id_investidor referenciam usuários, não colunas não-únicas em negociacoes
    CONSTRAINT fk_emprest_tomador
        FOREIGN KEY (id_tomador)
        REFERENCES usuarios (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_emprest_investidor
        FOREIGN KEY (id_investidor)
        REFERENCES usuarios (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

