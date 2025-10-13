"""Modelos da entidade ``scores_credito`` utilizados pela API."""

from datetime import datetime
from typing import Any, Dict, Optional

from pydantic import BaseModel, ConfigDict
from sqlalchemy import Column, DateTime, Float, Integer, JSON

from app.database.database import Base


class ScoreCredito(Base):
	"""Modelo SQLAlchemy que representa a tabela ``scores_credito``."""

	__tablename__ = "scores_credito"

	id = Column(Integer, primary_key=True, index=True, autoincrement=True)
	id_usuarios = Column(Integer, nullable=False, unique=True, index=True)
	valor_score = Column(Float, nullable=False)
	atualizado_em = Column(DateTime, nullable=False, default=datetime.utcnow)
	analise = Column(JSON, nullable=True)
	risco = Column(Float, nullable=True)


class ScoreCreditoResponse(BaseModel):
	"""Esquema retornado pelos endpoints de score de crédito."""

	id: int
	id_usuarios: int
	valor_score: float
	atualizado_em: datetime
	analise: Optional[Dict[str, Any]] = None
	risco: Optional[float] = None

	model_config = ConfigDict(from_attributes=True)


class ScoreDetalhadoResponse(BaseModel):
	"""Resposta detalhada ao recalcular o score via modelo interno."""

	score: ScoreCreditoResponse
	score_modelo: float
	score_serasa: float
	prob_default: float
	analise: Dict[str, Any]

	model_config = ConfigDict(from_attributes=True)
