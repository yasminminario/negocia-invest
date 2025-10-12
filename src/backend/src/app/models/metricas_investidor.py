"""Modelos da entidade ``metricas_investidor``."""

from datetime import datetime
from typing import Any, Dict, Optional

from pydantic import BaseModel, ConfigDict
from sqlalchemy import Column, DateTime, Float, Integer, JSON

from app.database.database import Base


class MetricasInvestidor(Base):
	"""Modelo SQLAlchemy para a tabela de métricas dos investidores."""

	__tablename__ = "metricas_investidor"

	id = Column(Integer, primary_key=True, autoincrement=True, index=True)
	id_usuarios = Column(Integer, nullable=False, index=True)
	valor_total_investido = Column(Float, nullable=False, default=0)
	rentabilidade_media_am = Column(Float, nullable=False, default=0)
	patrimonio = Column(Float, nullable=False, default=0)
	risco_medio = Column(Float, nullable=True)
	analise_taxa = Column(JSON, nullable=True)
	atualizado_em = Column(DateTime, nullable=False, default=datetime.utcnow)


class MetricasInvestidorResponse(BaseModel):
	"""Esquema retornado pelos endpoints de métricas."""

	id: int
	id_usuarios: int
	valor_total_investido: float
	rentabilidade_media_am: float
	patrimonio: float
	risco_medio: Optional[float] = None
	analise_taxa: Optional[Dict[str, Any]] = None
	atualizado_em: datetime

	model_config = ConfigDict(from_attributes=True)
