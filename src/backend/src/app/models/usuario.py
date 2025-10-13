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
	cpf = Column(String(20), nullable=False, unique=True)
	endereco = Column(String(255), nullable=True)
	renda_mensal = Column(Numeric(asdecimal=False), nullable=True)
	celular = Column(String(40), nullable=False)
	wallet_adress = Column(String, nullable=False, unique=True)
	facial = Column(Float, nullable=False)
	saldo_cc = Column(Numeric(asdecimal=False), nullable=False, default=0)
	criado_em = Column(DateTime, default=datetime.utcnow, nullable=False)


class UsuarioResponse(BaseModel):
	"""Esquema sanitizado retornado pelos endpoints de usuários."""

	id: int
	nome: str
	email: str
	saldo_cc: float
	cpf_mascarado: Optional[str] = None
	celular_mascarado: Optional[str] = None
	iniciais: Optional[str] = None
	criado_em: datetime

	model_config = ConfigDict(from_attributes=True)


class UsuarioCreate(BaseModel):
	"""Esquema para criação de usuário via API.

	Inclui os campos necessários para inserir uma nova linha na tabela `usuarios`.
	Não inclui `id` nem `criado_em`.
	"""

	nome: str
	email: str
	cpf: str
	endereco: Optional[str] = None
	renda_mensal: Optional[float] = None
	celular: str
	facial: float = 0.0
	saldo_cc: Optional[float] = 0.0

	model_config = ConfigDict(from_attributes=True)