"""Serviços para consulta de scores de crédito."""

from typing import Optional

from sqlalchemy.orm import Session

from app.models.score import ScoreCredito


class ScoreCreditoService:
    """Consultas relacionadas aos scores de crédito."""

    @staticmethod
    def obter_por_usuario(db: Session, usuario_id: int) -> Optional[ScoreCredito]:
        return (
            db.query(ScoreCredito)
            .filter(ScoreCredito.id_usuarios == usuario_id)
            .order_by(ScoreCredito.atualizado_em.desc())
            .first()
        )
