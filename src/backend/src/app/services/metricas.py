"""Serviços para métricas de investidor."""

from typing import Optional

from sqlalchemy.orm import Session

from app.models.metricas_investidor import MetricasInvestidor


class MetricasInvestidorService:
    """Operações de leitura das métricas dos investidores."""

    @staticmethod
    def obter_por_usuario(db: Session, usuario_id: int) -> Optional[MetricasInvestidor]:
        return (
            db.query(MetricasInvestidor)
            .filter(MetricasInvestidor.id_usuarios == usuario_id)
            .order_by(MetricasInvestidor.atualizado_em.desc())
            .first()
        )
