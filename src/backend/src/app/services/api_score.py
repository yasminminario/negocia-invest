from sqlalchemy.orm import Session
from sqlalchemy import text
"""
Este arquivo é responsável por expor a API do modelo de score, cujo código principal está localizado em src/backend/src/model.
Aqui são definidos os endpoints que permitem a interação com o modelo de score, facilitando o consumo por outras partes da aplicação.


"""


# src/backend/src/app/services/score.py

def montar_analise_usuario(user_id: int, db: Session) -> dict:
    # Tempo na plataforma (meses)
    tempo_na_plataforma_meses = db.execute(text(
        "SELECT EXTRACT(EPOCH FROM (NOW() - u.criado_em)) / 2629800.0 AS meses FROM usuarios u WHERE u.id = :user_id;"),
        {"user_id": user_id}
    ).scalar() or 0

    # Empréstimos contratados
    emprestimos_contratados = db.execute(text(          
        "SELECT COUNT(*) FROM negociacoes n WHERE n.id_tomador = :user_id AND n.assinado_em IS NOT NULL;"),
        {"user_id": user_id}
    ).scalar() or 0

    # Empréstimos quitados
    emprestimos_quitados = db.execute(text(
        "SELECT COUNT(*) FROM negociacoes n WHERE n.id_tomador = :user_id AND n.status = 'quitado';"),
        {"user_id": user_id}
    ).scalar() or 0

    # Empréstimos inadimplentes
    emprestimos_inadimplentes = db.execute(text(
        "SELECT COUNT(*) FROM negociacoes n WHERE n.id_tomador = :user_id AND n.status = 'inadimplente';"),
        {"user_id": user_id}
    ).scalar() or 0

    # Taxa de inadimplência
    taxa_inadimplencia = db.execute(text(
        "WITH base AS (SELECT COUNT(*)::float AS total FROM negociacoes n WHERE n.id_tomador = :user_id AND n.assinado_em IS NOT NULL), inad AS (SELECT COUNT(*)::float AS qte FROM negociacoes n WHERE n.id_tomador = :user_id AND n.status = 'inadimplente') SELECT CASE WHEN base.total = 0 THEN 0 ELSE (inad.qte / base.total) END AS taxa FROM base, inad;"),
        {"user_id": user_id}
    ).scalar() or 0.0

    # Média taxa de juros paga / média prazo contratado
    # Adaptar para faixas: taxa_sugerida pode ser '12-15', '10', etc.
    rows = db.execute(text(
        "SELECT p.taxa_sugerida, p.prazo_meses FROM propostas p JOIN negociacoes n ON n.id = p.id_negociacoes WHERE n.id_tomador = :user_id AND n.assinado_em IS NOT NULL AND p.status = 'aceita';"),
        {"user_id": user_id}
    ).fetchall()
    taxas = []
    prazos = []
    for taxa_str, prazo in rows:
        if taxa_str:
            if '-' in taxa_str:
                partes = taxa_str.split('-')
                try:
                    min_t = float(partes[0].strip())
                    max_t = float(partes[1].strip())
                    taxa = (min_t + max_t) / 2
                except Exception:
                    taxa = None
            else:
                try:
                    taxa = float(taxa_str.strip())
                except Exception:
                    taxa = None
            if taxa is not None:
                taxas.append(taxa)
        if prazo is not None:
            prazos.append(prazo)
    media_taxa_juros_paga = round(sum(taxas) / len(taxas), 2) if taxas else 0.0
    media_prazo_contratado = round(sum(prazos) / len(prazos), 2) if prazos else 0.0

    # Renda mensal
    renda_mensal = db.execute(text(
        "SELECT COALESCE(u.renda_mensal, 0) FROM usuarios u WHERE u.id = :user_id;"),
        {"user_id": user_id}
    ).scalar() or 0.0

    # Endividamento estimado
    endividamento_estimado = db.execute(text(
        "WITH renda AS (SELECT COALESCE(u.renda_mensal, 0) AS renda FROM usuarios u WHERE u.id = :user_id), divida AS (SELECT COALESCE(SUM(p.valor), 0) AS aberto FROM propostas p JOIN negociacoes n ON n.id = p.id_negociacoes WHERE n.id_tomador = :user_id AND n.status IN ('em andamento') AND p.status = 'aceita') SELECT CASE WHEN renda.renda = 0 THEN 0 ELSE (divida.aberto / renda.renda) END AS endividamento FROM renda, divida;"),
        {"user_id": user_id}
    ).scalar() or 0.0

    # Propostas realizadas / propostas aceitas
    propostas_realizadas, propostas_aceitas = db.execute(text(  
        "SELECT SUM(CASE WHEN p.autor_tipo = 'tomador' THEN 1 ELSE 0 END) AS propostas_realizadas, SUM(CASE WHEN p.autor_tipo = 'tomador' AND p.status = 'aceita' THEN 1 ELSE 0 END) AS propostas_aceitas FROM propostas p JOIN negociacoes n ON n.id = p.id_negociacoes WHERE n.id_tomador = :user_id;"),
        {"user_id": user_id}
    ).fetchone() or (0, 0)

    # Média tempo negociação (dias)
    media_tempo_negociacao_dias = db.execute(text(
        "WITH first_prop AS (SELECT MIN(p.criado_em) AS primeira_data FROM propostas p JOIN negociacoes n ON n.id = p.id_negociacoes WHERE n.id_tomador = :user_id AND p.autor_tipo = 'tomador'), assinada AS (SELECT AVG(EXTRACT(EPOCH FROM (n.assinado_em - fp.primeira_data)) / 86400.0) AS media_dias FROM negociacoes n CROSS JOIN first_prop fp WHERE n.id_tomador = :user_id AND n.assinado_em IS NOT NULL AND fp.primeira_data IS NOT NULL) SELECT COALESCE(media_dias, 0.0) FROM assinada;"),
        {"user_id": user_id}
    ).scalar() or 0.0

    analise = {
        "tempo_na_plataforma_meses": tempo_na_plataforma_meses,
        "emprestimos_contratados": emprestimos_contratados,
        "emprestimos_quitados": emprestimos_quitados,
        "emprestimos_inadimplentes": emprestimos_inadimplentes,
        "taxa_inadimplencia": taxa_inadimplencia,
        "media_taxa_juros_paga": media_taxa_juros_paga,
        "media_prazo_contratado": media_prazo_contratado,
        "renda_mensal": renda_mensal,
        "endividamento_estimado": endividamento_estimado,
        "propostas_realizadas": propostas_realizadas,
        "propostas_aceitas": propostas_aceitas,
        "media_tempo_negociacao_dias": media_tempo_negociacao_dias,
    }
    return analise