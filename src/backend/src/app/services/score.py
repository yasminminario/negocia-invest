from sqlalchemy.orm import Session
from sqlalchemy import text

def tempo_na_plataforma_meses(user_id: int, db: Session) -> float:
    """
    Calcula o tempo em meses que o usuário está na plataforma, baseado no campo criado_em da tabela usuarios.
    Args:
        user_id (int): ID do usuário
        db (Session): Sessão do banco de dados
    Returns:
        float: tempo em meses
    """
    query = text("SELECT EXTRACT(EPOCH FROM (NOW() - u.criado_em)) / 2629800.0 AS meses FROM usuarios u WHERE u.id = :user_id;")
    meses = db.execute(query, {"user_id": user_id}).scalar() or 0.0
    return meses

def calcular_score_final(score_modelo: float, score_serasa: float, user_id: int, db: Session) -> float:
    """
    Calcula a média ponderada dos scores do modelo próprio e do Serasa, ajustando o peso do Serasa conforme tempo na plataforma.
    Busca o tempo de plataforma diretamente do banco.
    Args:
        score_modelo (float): Score do modelo próprio
        score_serasa (float): Score do Serasa
        user_id (int): ID do usuário
        db (Session): Sessão do banco de dados
    Returns:
        float: Score final
    """
    tempo_meses = float(tempo_na_plataforma_meses(user_id, db))
    peso_serasa = max(0.1, 0.4 * (0.95 ** tempo_meses))
    peso_modelo = 1 - peso_serasa
    score_final = score_modelo * peso_modelo + score_serasa * peso_serasa
    return int(score_final)
