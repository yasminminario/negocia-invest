"""Modelos da entidade ``usuarios`` utilizados pela API."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict
from sqlalchemy import Column, DateTime, Float, Integer, Numeric, String

from app.database.database import Base


class Usuario(Base):
	"""Modelo SQLAlchemy que representa a tabela ``usuarios``."""

	__tablename__ = "usuarios"

	id = Column(Integer, primary_key=True, index=True, autoincrement=True)
	nome = Column(String(160), nullable=False)
	email = Column(String(160), nullable=False, unique=True, index=True)
	senha = Column(String(255), nullable=False)
	cpf = Column(String(20), nullable=True, unique=True)
	endereco = Column(String(255), nullable=True)
	renda_mensal = Column(Numeric(asdecimal=False), nullable=True)
	celular = Column(String(40), nullable=True)
	wallet_adress = Column(String, nullable=False, unique=True)
	facial = Column(Float, nullable=True)
	saldo_cc = Column(Numeric(asdecimal=False), nullable=True, default=0)
	criado_em = Column(DateTime, default=datetime.utcnow, nullable=False)


class UsuarioResponse(BaseModel):
	"""Esquema sanitizado retornado pelos endpoints de usuários."""

	id: int
	nome: str
	email: str
	wallet_adress: str
	saldo_cc: Optional[float] = None
	renda_mensal: Optional[float] = None
	senha: str
	endereco: Optional[str] = None
	facial: Optional[float] = None
	cpf_mascarado: Optional[str] = None
	celular_mascarado: Optional[str] = None
	iniciais: Optional[str] = None
	criado_em: datetime

	model_config = ConfigDict(from_attributes=True)

